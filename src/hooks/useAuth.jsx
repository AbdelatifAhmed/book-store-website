import { useSelector } from 'react-redux';

export const useAuthFetch = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(userInfo?.token && { 'Authorization': `Bearer ${userInfo.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    return response;
  };

  return authFetch;
};