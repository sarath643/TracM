export interface AppConfig {
  apiUrl: string;
  apiDomain: string;
  appUrl: string;
  appName: string;
}

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || 'localhost:3001';
const API_URL = `${import.meta.env.VITE_API_PROTOCOL || 'http'}://${API_DOMAIN}`;

export const appConfig: AppConfig = {
  appName: 'Track your Money',
  appUrl: '',
  apiUrl: API_URL,
  apiDomain: API_DOMAIN,
};
