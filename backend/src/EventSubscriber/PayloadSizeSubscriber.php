<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class PayloadSizeSubscriber implements EventSubscriberInterface
{
    private const MAX_PAYLOAD_SIZE = 102400; // 100ko

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 20],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }
        $request = $event->getRequest();
        $method = $request->getMethod();
        // On ne limite que POST/PUT/PATCH/DELETE
        if (!in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return;
        }
        // HeaderBag::get default must be string|null, then cast
        $contentLength = (int) ($request->headers->get('Content-Length', '0'));
        if ($contentLength > self::MAX_PAYLOAD_SIZE) {
            $event->setResponse(new JsonResponse([
                'error' => 'Payload trop volumineux',
                'message' => 'La requête dépasse la taille maximale autorisée (100ko).',
            ], 413));
            return;
        }
        // Pour les serveurs proxy qui ne transmettent pas Content-Length, on vérifie le contenu brut
        if ($contentLength === 0 && strlen($request->getContent()) > self::MAX_PAYLOAD_SIZE) {
            $event->setResponse(new JsonResponse([
                'error' => 'Payload trop volumineux',
                'message' => 'La requête dépasse la taille maximale autorisée (100ko).',
            ], 413));
        }
    }
}
