'use client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useActionState } from 'react';
import { FormState, login } from '~/app/actions/auth';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { ErrorDisplay } from '~/components/ui/error-display';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const initialState: FormState = {
  success: false,
  errors: {},
  data: {
    email: '',
    password: '',
  },
};

const Login = () => {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="flex justify-center items-center min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/office.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <Card className="w-[90%] max-w-md relative z-10">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Zaloguj się</CardTitle>
          <CardDescription className="text-center text-gray-600 font-normal">
            Wprowadź wszystkie swoje dane, aby sie zalogować
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} id="register-form">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={state?.data?.email ?? ''} placeholder="m@example.com" required />
                {state.errors.email && <ErrorDisplay message={state.errors.email[0] ?? ''} />}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  defaultValue={state?.data?.password ?? ''}
                  required
                  placeholder="Wprowadź hasło"
                />
                {state.errors.password && <ErrorDisplay message={state.errors.password[0] ?? ''} />}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-4 w-full">
            <Button type="submit" variant="register" className="w-full" form="register-form" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Zaloguj się'}
            </Button>
            {state.errors.other && <ErrorDisplay message={state.errors.other[0] ?? ''} />}
            <div className="text-center text-sm text-gray-600">
              <span>Nie masz konta?</span>{' '}
              <Link
                className="text-primary-red font-medium hover:text-primary-red/90 hover:cursor-pointer hover:underline"
                href="/register"
              >
                Zarejestruj się
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
