import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMe, refresh } from '../../store/auth/authSlice';

const AppInit = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        await dispatch(refresh());
      } finally {
        dispatch(fetchMe());
      }
    })();
  }, [dispatch]);
  return null;
};

export default AppInit;

