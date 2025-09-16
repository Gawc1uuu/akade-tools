'use client';
import React, { useState } from 'react';
import CreateCarForm from '~/app/(pages)/cars/components/create-car-form';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { useRouter } from 'next/navigation';

const CreateCarModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Dodaj pojazd</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Dodaj pojazd</DialogTitle>
          <DialogDescription>Dodaj pojazd do bazy danych.</DialogDescription>
        </DialogHeader>
        <CreateCarForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCarModal;
