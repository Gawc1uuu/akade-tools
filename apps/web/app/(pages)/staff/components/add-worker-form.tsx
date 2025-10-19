'use client';
import React, { useActionState, useEffect } from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { inviteWorker } from '~/app/actions/staff/invite-worker';
import { ErrorDisplay } from '~/components/ui/error-display';
import { Loader2 } from 'lucide-react';

const AddWorkerForm = ({ onSuccess, setIsOpen }: { onSuccess: () => void; setIsOpen: (isOpen: boolean) => void }) => {
  const [state, formAction, isPending] = useActionState(inviteWorker, { success: false, errors: {}, data: {} });

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <div>
      <form id="add-worker-form" action={formAction}>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="name">E-mail</Label>
              <Input id="name" name="email" placeholder="email@example.com" defaultValue={state.data?.email} />
              <Input id="name" name="email" placeholder="email@example.com" defaultValue={state.data?.email} />
            </div>
            {state.errors.email && <ErrorDisplay messages={state.errors.email} />}
            {state.errors.other && <ErrorDisplay messages={state.errors.other} />}
          </div>
          <div className="flex gap-2 w-full justify-end items-center">
            <Button className="hover:bg-red-500/90 cursor-pointer" type="button" variant="destructive" onClick={() => setIsOpen(false)}>
              Anuluj
            </Button>
            <Button className="hover:bg-primary/90 cursor-pointer" type="submit" form="add-worker-form" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Zaproś pracownika</span>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddWorkerForm;
