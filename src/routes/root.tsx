import type { LoaderFunctionArgs } from 'react-router-dom';
import { Form, NavLink, Outlet, redirect, useLoaderData, useNavigation } from 'react-router-dom';

import { useState } from 'react';
import type { LoaderData } from 'src/routerTypes';
import { createEmptyContact, getContacts } from '../contacts';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export function Root() {
  const { contacts, q: defaultQuery } = useLoaderData() as LoaderData<typeof loader>;
  const [query, setQuery] = useState(defaultQuery ?? '');
  const navigation = useNavigation();

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div aria-live="polite" className="sr-only" />
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) => (isActive ? 'active' : isPending ? 'pending' : '')}
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={navigation.state === 'loading' ? 'loading' : ''}>
        <Outlet />
      </div>
    </>
  );
}
