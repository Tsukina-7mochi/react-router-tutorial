import type { LoaderFunctionArgs } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import invariant from 'tiny-invariant';
import { deleteContact } from '../contacts';

export async function action({ params }: LoaderFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param');

  await deleteContact(params.contactId);
  return redirect('/');
}
