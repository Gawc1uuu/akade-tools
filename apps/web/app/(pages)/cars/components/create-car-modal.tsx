'use client';
import React, { useActionState } from 'react';
import { Calendar28 } from '~/app/(pages)/cars/components/date-picker-input';
import { createCar } from '~/app/actions/cars/create-car';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { ErrorDisplay } from '~/components/ui/error-display';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

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

const CreateCarModal = () => {
  const [state, formAction, isPending] = useActionState(
    createCar,
    initialState
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Dodaj pojazd</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj pojazd</DialogTitle>
          <DialogDescription>Dodaj pojazd do bazy danych.</DialogDescription>
        </DialogHeader>
        <form action={formAction} id="create-car-form">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="make">Marka</Label>
              <Input id="make" name="make" defaultValue={state.data?.make} placeholder="Marka" />
              {state.errors && 'make' in state.errors && state.errors.make && <ErrorDisplay messages={state.errors.make ?? []} />}
              </div>
            <div className="grid gap-3">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" defaultValue={state.data?.model} placeholder="Model" />
              {state.errors && 'model' in state.errors && state.errors.model && <ErrorDisplay messages={state.errors.model ?? []} />}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="registrationNumber">Numer rejestracyjny</Label>
              <Input id="registrationNumber" name="registrationNumber" defaultValue={state.data?.registrationNumber} placeholder="Numer rejestracyjny" />
              {state.errors && 'registrationNumber' in state.errors && state.errors.registrationNumber && <ErrorDisplay messages={state.errors.registrationNumber ?? []} />}
            </div>
            <div className="grid gap-3">
              <Calendar28 name="insuranceEndDate" defaultValue="" placeholder="Data końca ubezpieczenia" label="Data końca ubezpieczenia" />
              {state.errors && 'insuranceEndDate' in state.errors && state.errors.insuranceEndDate && <ErrorDisplay messages={state.errors.insuranceEndDate ?? []} />}
            </div>
            <div className="grid gap-3">
              <Calendar28 name="inspectionEndDate" defaultValue="" placeholder="Data końca przeglądu" label="Data końca przeglądu" />
              {state.errors && 'inspectionEndDate' in state.errors && state.errors.inspectionEndDate && <ErrorDisplay messages={state.errors.inspectionEndDate ?? []} />}
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Anuluj</Button>
          </DialogClose>
          <Button type="submit" form="create-car-form">
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCarModal;
