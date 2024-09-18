import { LoaderFunction } from '@remix-run/node';
import { sharpLoader } from '~/shared/RemixJS/server';

export const loader: LoaderFunction = sharpLoader;
