import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import axios, { AxiosResponse } from 'axios';
import { authSessionStorage } from '~/packages/_Common/Auth/utils/sessionStorage';
import { RefreshTokenResponse, RefreshTokenData } from '~/routes/_auth.refresh-token';
import { FetchAPI } from '~/shared/Utilities';

export const fetchApiServer = async ({ request }: LoaderFunctionArgs | ActionFunctionArgs) => {
  const session = await authSessionStorage.getSession(request);
  const fetchApi = new FetchAPI({
    baseConfig: {
      baseURL: 'https://express-for-boilerplates-with-restful-api.vercel.app',
    },
    refreshTokenConfig: {
      request: async ({ accessToken, refreshToken }) => {
        const response = await axios.request<
          RefreshTokenResponse | undefined,
          AxiosResponse<RefreshTokenResponse | undefined>,
          RefreshTokenData
        >({
          method: 'POST',
          baseURL: new URL(request.url).origin,
          url: '/refresh-token',
          data: {
            accessToken,
            refreshToken,
          },
        });
        return response;
      },
      success: response => {
        const response_ = response as AxiosResponse<RefreshTokenResponse | undefined>;
        console.log('Fetch API Server:: Token refreshed successfully!', response_.data?.info);
        fetchApi.setAccessToken = () => response_.data?.info.session.accessToken ?? '';
        fetchApi.setRefreshToken = () => response_.data?.info.session.refreshToken ?? '';
      },
      failure: () => {
        console.log('Fetch API Server:: Token refreshed failure!');
        throw redirect('/login');
      },
      setRefreshCondition: error => {
        return error.response?.status === 403;
      },
    },
    setConditionApplyAccessToken: () => {
      return true;
    },
    setAccessToken: () => {
      return session.data.accessToken ?? '';
    },
    setRefreshToken: () => {
      return session.data.refreshToken ?? '';
    },
  });

  return fetchApi;
};
