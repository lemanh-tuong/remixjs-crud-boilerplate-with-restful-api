import { ActionFunctionArgs, TypedResponse, json, redirect } from '@remix-run/node';
import { SimpleActionResponse } from '~/types/SimpleActionResponse';
import { handleCatchClauseAsSimpleResponse } from '~/utils/functions/handleErrors/handleCatchClauseSimple';

export type DeleteBrandingActionResponse = SimpleActionResponse<undefined, undefined>;
export const action = async ({ params }: ActionFunctionArgs): Promise<TypedResponse<DeleteBrandingActionResponse>> => {
  try {
    if (params['id']) {
      return json({
        hasError: false,
        message: 'Removed',
        info: undefined,
      });
    }
    return redirect('/branding');
  } catch (error) {
    return handleCatchClauseAsSimpleResponse(error);
  }
};
