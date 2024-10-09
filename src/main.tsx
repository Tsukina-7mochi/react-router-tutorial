import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './error-page';
import { Contact, action as contactAction, loader as contactLoader } from './routes/contact';
import { action as destroyAction } from './routes/destroy';
import { EditContact, action as editAction } from './routes/edit';
import { Index } from './routes/index';
import { Root, action as rootAction, loader as rootLoader } from './routes/root';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Index />,
          },
          {
            path: 'contacts/:contactId',
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: 'contacts/:contactId/edit',
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: 'contacts/:contactId/destroy',
            action: destroyAction,
          },
        ],
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
