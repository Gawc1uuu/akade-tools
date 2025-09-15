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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const CreateCarModal = () => {
  const [state, formAction] = useActionState(createCar, null);

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
              <Input id="make" name="make" defaultValue="" placeholder="Marka" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" defaultValue="" placeholder="Model" />
            </div>
            <div className="grid gap-3">
              <Calendar28 name="insuranceEndDate" defaultValue="" placeholder="Data końca ubezpieczenia" label="Data końca ubezpieczenia" />
            </div>
            <div className="grid gap-3">
              <Calendar28 name="inspectionEndDate" defaultValue="" placeholder="Data końca przeglądu" label="Data końca przeglądu" />
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
