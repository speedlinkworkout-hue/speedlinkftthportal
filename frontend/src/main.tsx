import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/app/App';
import { Providers } from '@/app/Providers';
import { useAccountStore } from '@/stores/account.store';
import { mockAccounts, defaultAccountId } from '@/lib/mock/mockAccounts';
import '@/index.css';

useAccountStore.getState().setAccounts(mockAccounts);
useAccountStore.getState().setActiveAccount(defaultAccountId);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);
