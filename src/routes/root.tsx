import { Form, NavLink, Outlet, redirect, useLoaderData } from 'react-router-dom';

import type { LoaderData } from 'src/routerTypes';
import { createEmptyContact, getContacts } from '../contacts';

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}

export async function action() {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export function Root() {
  const { contacts } = useLoaderData() as LoaderData<typeof loader>;

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q" />
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
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
