'use client';
import React, { useState } from 'react';
import AddWorkerForm from '~/app/(pages)/staff/components/add-worker-form';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';

const AddWorkerDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="hover:bg-primary/90 cursor-pointer">Dodaj pracownika</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj pracownika</DialogTitle>
        </DialogHeader>
        <AddWorkerForm isOpen={isOpen} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkerDialog;
