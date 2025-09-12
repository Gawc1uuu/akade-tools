import { cookies } from 'next/headers';
import { Session } from '~/lib/types';

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function saveSession(payload: Session) {
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(payload), {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(Date.now() + 1000 * 5), //FIXME: 5mins
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) {
    return null;
  }
  return JSON.parse(session);
}
