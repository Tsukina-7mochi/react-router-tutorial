import { Form, useFetcher, useLoaderData } from 'react-router-dom';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';
import type { LoaderData } from 'src/routerTypes';
import invariant from 'tiny-invariant';
import { type ContactRecord, getContact, updateContact } from '../contacts';

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param');
  const contact = await getContact(params.contactId);

  if (contact === null) {
    throw new Response('Not Found', { status: 404 });
  }

  return { contact };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  invariant(params.contactId, 'Missing contactId param');

  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true',
  });
}

export function Contact() {
  const { contact } = useLoaderData() as LoaderData<typeof loader>;

  const avatarImageUrl = contact.avatar;

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={avatarImageUrl} alt="" />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" rel="noreferrer" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

type FavoriteProps = {
  contact: ContactRecord;
};

function Favorite({ contact }: FavoriteProps) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData ? fetcher.formData.get('favorite') === 'true' : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name="favorite"
        type="submit"
        value={favorite ? 'false' : 'true'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
}
