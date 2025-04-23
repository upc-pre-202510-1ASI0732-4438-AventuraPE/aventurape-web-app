import Cookies from 'js-cookie';

export function authenticationInterceptor(config) {
  const token = Cookies.get('token');

  console.log('Current token:', token); // Debug token value

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`Adding Authorization header: Bearer ${token.substring(0, 10)}...`);
  } else {
    console.log('No token available for request:', config.url);
  }

  return config;
}