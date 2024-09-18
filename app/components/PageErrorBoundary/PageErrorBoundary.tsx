import { useLocation, useNavigate, useRouteError } from '@remix-run/react';
import { useEffect } from 'react';

export const PageErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('PageErrorBoundary:: ', error);
    if (!location.pathname.includes('500')) {
      navigate('/500');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return null;
};
