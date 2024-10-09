import { useCallback } from 'react';
import { Form, type LoaderFunctionArgs, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import type { LoaderData } from 'src/routerTypes';
import invariant from 'tiny-invariant';
import { updateContact } from '../contacts';
import type { loader as contactLoader } from './contact';

export async function action({ request, params }: LoaderFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param');

  const formData = await request.formData();
  const updates = Object.fromEntries(formData);

  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export function EditContact() {
  const { contact } = useLoaderData() as LoaderData<typeof contactLoader>;
  const navigate = useNavigate();

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input aria-label="First name" defaultValue={contact?.first} name="first" placeholder="First" type="text" />
        <input aria-label="Last name" defaultValue={contact?.last} name="last" placeholder="Last" type="text" />
      </p>
      <label>
        <span>Twitter</span>
        <input defaultValue={contact?.twitter} name="twitter" placeholder="@jack" type="text" />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact?.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact?.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={navigateBack} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
