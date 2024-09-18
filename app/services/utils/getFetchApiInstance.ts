import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { fetchApiClient } from '~/utils/fetchApi/fetchApi.client';
import { fetchApiServer } from '~/utils/fetchApi/fetchApi.server';

export const getFetchApiInstance = (remixRequest: LoaderFunctionArgs | ActionFunctionArgs | undefined) => {
  return remixRequest ? fetchApiServer(remixRequest) : Promise.resolve(fetchApiClient);
};
