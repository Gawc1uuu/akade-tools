'use client';
import React, { useActionState, useEffect } from 'react';
import { Calendar28 } from '~/components/date-picker-input';
import { createCar } from '~/app/actions/cars/create-car';
import { Button } from '~/components/ui/button';
import { DialogClose, DialogFooter } from '~/components/ui/dialog';
import { ErrorDisplay } from '~/components/ui/error-display';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';

const initialState = {
  success: false,
  errors: {},
  data: {
    make: '',
    model: '',
    insuranceEndDate: '',
    inspectionEndDate: '',
  },
};

const CreateCarForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [state, formAction, isPending] = useActionState(createCar, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <>
      <form action={formAction} id="create-car-form">
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="make">Marka</Label>
            <Input
              id="make"
              name="make"
              defaultValue={state.data?.make}
              placeholder="Marka"
              className={cn(
                'bg-background border-border focus:ring-2 focus:ring-accent',
                state.errors.make && 'border-red-500 ring-2 ring-red-500/60'
              )}
              minLength={3}
              maxLength={255}
            />
            {state.errors?.make && <ErrorDisplay messages={state.errors.make} />}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              defaultValue={state.data?.model}
              placeholder="Model"
              className={cn(
                'bg-background border-border focus:ring-2 focus:ring-accent',
                state.errors.model && 'border-red-500 ring-2 ring-red-500/60'
              )}
              minLength={3}
              maxLength={255}
            />
            {state.errors?.model && <ErrorDisplay messages={state.errors.model} />}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="registrationNumber">Numer rejestracyjny</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              defaultValue={state.data?.registrationNumber}
              placeholder="Numer rejestracyjny"
              className={cn(
                'bg-background border-border focus:ring-2 focus:ring-accent',
                state.errors.registrationNumber && 'border-red-500 ring-2 ring-red-500/60'
              )}
              minLength={3}
              maxLength={255}
            />
            {state.errors?.registrationNumber && <ErrorDisplay messages={state.errors.registrationNumber} />}
          </div>
          <div className="grid gap-3">
            <Calendar28 name="insuranceEndDate" placeholder="Data końca ubezpieczenia" label="Data końca ubezpieczenia" />
            {state.errors?.insuranceEndDate && <ErrorDisplay messages={state.errors.insuranceEndDate} />}
          </div>
          <div className="grid gap-3">
            <Calendar28 name="inspectionEndDate" placeholder="Data końca przeglądu" label="Data końca przeglądu" />
            {state.errors?.inspectionEndDate && <ErrorDisplay messages={state.errors.inspectionEndDate} />}
          </div>
        </div>
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Anuluj</Button>
        </DialogClose>
        <Button type="submit" form="create-car-form" disabled={isPending}>
          {isPending ? 'Zapisywanie...' : 'Zapisz'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default CreateCarForm;
