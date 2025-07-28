<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RateLimitResponseSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => ['onKernelResponse', 0],
        ];
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $response = $event->getResponse();

        // Ajouter les headers de rate limiting si ils ont été définis dans la requête
        $rateLimitHeaders = $request->attributes->get('rate_limit_headers');
        
        if ($rateLimitHeaders) {
            foreach ($rateLimitHeaders as $header => $value) {
                $response->headers->set($header, (string) $value);
            }
        }
    }
}
