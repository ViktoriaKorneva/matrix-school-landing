import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
  return Response.json(
    {
      status: 'ok',
      chat: 'disabled',
    },
    {
      headers: {
        'cache-control': 'no-store',
      },
    },
  );
};
