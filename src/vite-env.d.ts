/// <reference types="vite/client" />

/**
 * Ambient typings for Google Identity Services
 * See: https://developers.google.com/identity/gsi/web/reference/js-reference
 */

type GoogleCredentialResponse = {
  credential: string;
  clientId?: string;
  select_by?: string;
};

type GoogleAccountsId = {
  initialize(options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  prompt(): void;
};

type GoogleIdentity = {
  accounts: {
    id: GoogleAccountsId;
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

export {};
