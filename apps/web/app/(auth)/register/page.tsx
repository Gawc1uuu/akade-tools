import Link from 'next/link'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const Register = () => {
  return (
        <div className='flex justify-center items-center h-screen'>
        <Card className='w-full max-w-lg'>
            <CardHeader>
                <CardTitle>Załóz konto</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className='flex flex-col gap-6'>
                        <div className='grid gap-2'>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='m@example.com'
                                required
                            />
                        </div>
                        <div className='grid gap-2'>
                        <Label htmlFor="password">Password</Label>
                            <Input
                                id='password'
                                type='password'
                                required
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <div className='flex flex-col gap-4 w-full'>
                <Button type="submit" className='w-full'>
                    Zarejestruj się
                </Button>
                <div className='text-center'>
                    <span>Masz juz konto?</span>{" "}
                    <Link href="#">Zaloguj się</Link>
                </div>
                </div>
            </CardFooter>
        </Card>
        </div>
  )
}

export default Register