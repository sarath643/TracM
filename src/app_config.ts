export interface AppConfig {
  apiUrl: string;
  apiDomain: string;
  appUrl: string;
  appName: string;
}

const API_DOMAIN = 'localhost:3000';

const API_URL = `https://${API_DOMAIN}`;

export const appConfig: AppConfig = {
  appName: 'Expense Tracker',
  appUrl: 'https://expense-tracker-eta.vercel.app',
  apiUrl: API_URL,
  apiDomain: API_DOMAIN,
};
