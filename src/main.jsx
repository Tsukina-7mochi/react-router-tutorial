import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './error-page';
import { Contact } from './routes/contact';
import { Root, loader as rootLoader } from './routes/root';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
