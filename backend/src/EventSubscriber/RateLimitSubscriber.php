<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\RateLimiter\RateLimiterFactoryInterface;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class RateLimitSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private RateLimiterFactoryInterface $loginAttemptsLimiter,
        private RateLimiterFactoryInterface $registrationAttemptsLimiter,
        private RateLimiterFactoryInterface $apiMutationsLimiter
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 10],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $path = $request->getPathInfo();
        $method = $request->getMethod();

        // Ignorer les requêtes OPTIONS (CORS preflight)
        if ($method === 'OPTIONS') {
            return;
        }

        $clientIp = $this->getClientIp($request);

        // Rate limiting pour /api/login
        if ($path === '/api/login' && $method === 'POST') {
            $limiter = $this->loginAttemptsLimiter->create($clientIp);
            $limit = $limiter->consume(1);
            
            if (!$limit->isAccepted()) {
                $this->throwRateLimitException($limit, 'login');
            }
            
            // Ajouter les headers de rate limiting
            $this->addRateLimitHeaders($request, $limit);
        }

        // Rate limiting pour /api/register
        if ($path === '/api/register' && $method === 'POST') {
            $limiter = $this->registrationAttemptsLimiter->create($clientIp);
            $limit = $limiter->consume(1);
            
            if (!$limit->isAccepted()) {
                $this->throwRateLimitException($limit, 'register');
            }
            
            // Ajouter les headers de rate limiting
            $this->addRateLimitHeaders($request, $limit);
        }

        // Rate limiting pour les mutations API (POST/PUT/DELETE sur /api/v1/*)
        if (str_starts_with($path, '/api/v1/') && in_array($method, ['POST', 'PUT', 'DELETE'])) {
            $limiter = $this->apiMutationsLimiter->create($clientIp);
            $limit = $limiter->consume(1);
            
            if (!$limit->isAccepted()) {
                $this->throwRateLimitException($limit);
            }
            
            // Ajouter les headers de rate limiting
            $this->addRateLimitHeaders($request, $limit);
        }
    }

    private function getClientIp($request): string
    {
        // Récupérer la vraie IP du client (en tenant compte des proxies)
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ips = explode(',', $_SERVER[$key]);
                $ip = trim($ips[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        return $request->getClientIp() ?? '127.0.0.1';
    }

    private function throwRateLimitException($limit, $context = null): void
    {
        $retryAfter = $limit->getRetryAfter();

        // Message personnalisé selon le contexte
        if ($context === 'register') {
            $userMessage = 'Trop de tentatives de création de compte. Veuillez patienter avant de réessayer.';
        } elseif ($context === 'login') {
            $userMessage = 'Trop de tentatives de connexion. Veuillez patienter avant de réessayer.';
        } else {
            $userMessage = 'Trop de requêtes. Veuillez réessayer plus tard.';
        }

        $response = new JsonResponse([
            'error' => 'Rate limit exceeded',
            'message' => $userMessage,
            'retry_after' => $retryAfter->getTimestamp() - time(),
        ], 429);

        // Headers standards pour rate limiting
        $response->headers->set('X-RateLimit-Limit', (string) $limit->getLimit());
        $response->headers->set('X-RateLimit-Remaining', (string) $limit->getRemainingTokens());
        $response->headers->set('X-RateLimit-Reset', (string) $retryAfter->getTimestamp());
        $response->headers->set('Retry-After', (string) ($retryAfter->getTimestamp() - time()));

        throw new TooManyRequestsHttpException($retryAfter->getTimestamp() - time(), $userMessage, null, 429, $response->headers->all());
    }

    private function addRateLimitHeaders($request, $limit): void
    {
        $retryAfter = $limit->getRetryAfter();
        
        // Stocker les headers pour les ajouter à la réponse
        $request->attributes->set('rate_limit_headers', [
            'X-RateLimit-Limit' => $limit->getLimit(),
            'X-RateLimit-Remaining' => $limit->getRemainingTokens(),
            'X-RateLimit-Reset' => $retryAfter->getTimestamp()
        ]);
    }
}
