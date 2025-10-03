'use client';
import React, { useActionState } from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { inviteWorker } from '~/app/actions/staff/invite-worker';

const AddWorkerForm = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  const [state, formAction, isPending] = useActionState(inviteWorker, null);

  return (
    <div>
      <form id="add-worker-form" action={formAction}>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="name">E-mail</Label>
              <Input id="name" name="email" placeholder="E-mail" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="name">Rola</Label>
              <Select name="role">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wybierz rolę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Użytkownik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 w-full justify-end items-center">
            <Button className="hover:bg-red-500/90 cursor-pointer" type="button" variant="destructive" onClick={() => setIsOpen(false)}>
              Anuluj
            </Button>
            <Button className="hover:bg-primary/90 cursor-pointer" type="submit" form="add-worker-form" disabled={isPending}>
              Dodaj pracownika
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddWorkerForm;
