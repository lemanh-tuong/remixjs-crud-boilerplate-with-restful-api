import { useActionData, useNavigation, useSearchParams } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getValidatedFormData } from 'remix-hook-form';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';
import { PageErrorBoundary } from '~/components/PageErrorBoundary/PageErrorBoundary';
import { FormLogin, FormLoginValues } from '~/packages/_Common/Auth/components/FormLogin';
import { SessionExpiredParams } from '~/packages/_Common/Auth/constants/SessionExpired';
import { getFormLoginResolver } from '~/packages/_Common/Auth/constants/zodResolver';
import { login } from '~/packages/_Common/Auth/services/login';
import { authSessionStorage } from '~/packages/_Common/Auth/utils/sessionStorage';
import { i18nServer } from '~/packages/_Common/I18n/i18n.server';
import { notification } from '~/shared/ReactJS';
import { updateURLSearchParamsOfBrowserWithoutNavigation } from '~/shared/Utilities';
import { SimpleActionResponse } from '~/types/SimpleActionResponse';
import { handleCatchClauseAsSimpleResponse } from '~/utils/functions/handleErrors/handleCatchClauseSimple';
import { handleFormResolverError } from '~/utils/functions/handleErrors/handleFormResolverError';
import { handleGetMessageToToast } from '~/utils/functions/handleErrors/handleGetMessageToToast';

export type ActionResponse = SimpleActionResponse<undefined, FormLoginValues>;
export const action = async (remixRequest: ActionFunctionArgs) => {
  const { request } = remixRequest;
  const t = await i18nServer.getFixedT(request, ['common', 'auth']);

  const { data, errors } = await getValidatedFormData<FormLoginValues>(request, getFormLoginResolver(t));

  const redirectTo = new URL(request.url).searchParams.get('redirectTo');
  try {
    if (data) {
      const loginResponse = await login({ password: data.password, email: data.email, remixRequest });
      return authSessionStorage.createSession({
        request,
        redirectTo: redirectTo ?? '/dashboard',
        remember: data?.remember ?? false,
        sessionData: {
          accessToken: [loginResponse.data.payload.type, loginResponse.data.payload.accessToken].join(' '),
          refreshToken: loginResponse.data.payload.refreshToken,
          profile: {
            avatar: '',
            fullName: loginResponse.data.member.memberName,
            role: loginResponse.data.member.role,
          },
        },
      });
    }
    return json(...handleFormResolverError(errors));
  } catch (error) {
    console.log('Auth Login:: ', error);
    return handleCatchClauseAsSimpleResponse(error);
  }
};

const LoginPage = () => {
  const { t } = useTranslation(['auth']);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [currentUrlSearchParams] = useSearchParams();

  const isSubmiting = useMemo(() => {
    return navigation.state === 'loading' || navigation.state === 'submitting';
  }, [navigation.state]);

  useEffect(() => {
    if (actionData?.hasError) {
      notification.error({
        message: t('auth:login_error'),
        description: handleGetMessageToToast(t, actionData),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  useEffect(() => {
    if (currentUrlSearchParams.get(SessionExpiredParams) !== null) {
      notification.error({
        message: t('auth:session_expired'),
        description: '',
      });
      currentUrlSearchParams.delete(SessionExpiredParams);
      updateURLSearchParamsOfBrowserWithoutNavigation(currentUrlSearchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrlSearchParams]);

  return (
    <>
      <h1 className="mb-6 text-[48px] font-semibold text-neutral-700">{t('auth:login')}</h1>
      <FormLogin loading={isSubmiting} />
    </>
  );
};

export default LoginPage;

export const ErrorBoundary = PageErrorBoundary;
