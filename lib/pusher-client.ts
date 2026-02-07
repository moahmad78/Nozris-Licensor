import PusherClient from 'pusher-js';

export const pusherClient = new PusherClient(
    'f39d4fa2f39e337ec669',
    {
        cluster: 'ap2',
    }
);
