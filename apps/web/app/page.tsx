import { getMe } from '~/app/actions/auth';
import { Button } from '~/components/ui/button';
import { getSession } from '~/lib/session';

export default async function Home() {
  return (
    <div>
      <h1 className="text-red-400 text-8xl">Hello World</h1>
      <Button>click me</Button>
    </div>
  );
}
