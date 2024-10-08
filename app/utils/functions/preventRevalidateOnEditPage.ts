import { ShouldRevalidateFunction } from '@remix-run/react';

const paths: string[] = [];

export const preventRevalidateOnEditPage: ShouldRevalidateFunction = ({ currentUrl }) => {
  if (paths.find(item => item === currentUrl.pathname)) {
    return true;
  }
  return false;
};
