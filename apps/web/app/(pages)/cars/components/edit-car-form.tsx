'use client';
import React, { useActionState, useEffect } from 'react';
import { Calendar28 } from '~/components/date-picker-input';
import { editCar } from '~/app/actions/cars/edit-car';
import { Button } from '~/components/ui/button';
import { DialogClose, DialogFooter } from '~/components/ui/dialog';
import { ErrorDisplay } from '~/components/ui/error-display';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Car } from '~/lib/types';
import { cn } from '~/lib/utils';
import { useRouter } from 'next/navigation';

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

interface EditCarFormProps {
  onSuccess: () => void;
  initialData: Car;
}

const EditCarForm = ({ onSuccess, initialData }: EditCarFormProps) => {
  const [state, formAction, isPending] = useActionState(editCar, initialState);
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      onSuccess();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, onSuccess]);

  return (
    <>
      <form action={formAction} id="edit-car-form">
        <div className="grid gap-4">
          <div className="grid gap-3">
            <input type="hidden" name="id" value={initialData.id} />
            <Label htmlFor="make">Marka</Label>
            <Input
              id="make"
              name="make"
              defaultValue={initialData?.make}
              placeholder="Marka"
              className={cn(
                'bg-background border-border focus:ring-2 focus:ring-accent',
                state.errors.make && 'border-red-500 ring-2 ring-red-500/60'
              )}
            />
            {state.errors?.make && <ErrorDisplay messages={state.errors.make} />}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              defaultValue={initialData?.model}
              placeholder="Model"
              className={cn(
                'bg-background border-border focus:ring-2 focus:ring-accent',
                state.errors.model && 'border-red-500 ring-2 ring-red-500/60'
              )}
            />
            {state.errors?.model && <ErrorDisplay messages={state.errors.model} />}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="registrationNumber">Numer rejestracyjny</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              defaultValue={initialData?.registrationNumber}
              placeholder="Numer rejestracyjny"
              className={cn(
                'bg-background border-border focus:ring-2 focus:ring-accent',
                state.errors.registrationNumber && 'border-red-500 ring-2 ring-red-500/60'
              )}
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
          <Button className="hover:cursor-pointer" variant="outline">
            Anuluj
          </Button>
        </DialogClose>
        <Button className="hover:cursor-pointer" type="submit" form="edit-car-form" disabled={isPending}>
          {isPending ? 'Zapisywanie...' : 'Zapisz'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default EditCarForm;
