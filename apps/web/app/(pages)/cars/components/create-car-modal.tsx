import React from 'react'
import { Calendar28 } from '~/app/(pages)/cars/components/date-picker-input';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const CreateCarModal = () => {
  return (
    <Dialog>
    <form>
      <DialogTrigger asChild>
        <Button variant="outline">Dodaj pojazd</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj pojazd</DialogTitle>
          <DialogDescription>
            Dodaj pojazd do bazy danych.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Marka</Label>
            <Input id="name-1" name="make" defaultValue="" placeholder="Marka" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username-1">Model</Label>
            <Input id="username-1" name="model" defaultValue="" placeholder="Model" />
          </div>
          <div className="grid gap-3">
            <Calendar28 name="insuranceEndDate" defaultValue="" placeholder="Data końca ubezpieczenia" label="Data końca ubezpieczenia" />
          </div>
          <div className="grid gap-3">
            <Calendar28 name="inspectionEndDate" defaultValue="" placeholder="Data końca przeglądu" label="Data końca przeglądu" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Anuluj</Button>
          </DialogClose>
          <Button type="submit">Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
  )
}

export default CreateCarModal