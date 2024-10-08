import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { authSessionStorage } from '~/packages/_Common/Auth/utils/sessionStorage';

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  return await authSessionStorage.destroySession({
    request,
    redirectUrl: loginUrl => [loginUrl, searchParams].filter(Boolean).join('?'),
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  return await authSessionStorage.destroySession({
    request,
    redirectUrl: loginUrl => [loginUrl, searchParams].filter(Boolean).join('?'),
  });
};
