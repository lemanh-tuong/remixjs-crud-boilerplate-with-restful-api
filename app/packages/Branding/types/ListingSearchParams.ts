import { lisitngUrlSearchParamsUtils } from '../utils/listingUrlSearchParams';
import { GetTypeOfSearchParamsFromUrlParamsUtils } from '~/shared/RemixJS/types';

export type ListingSearchParams = GetTypeOfSearchParamsFromUrlParamsUtils<typeof lisitngUrlSearchParamsUtils>;
