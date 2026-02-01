export enum ViewState {
  HOME = 'HOME',
  CHAT = 'CHAT',
  MENU = 'MENU',
  INSPIRATION = 'INSPIRATION',
  SHOP = 'SHOP'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingSources?: { title: string; uri: string }[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  isPopular?: boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        openLink: (url: string) => void;
      }
    };
  }
}