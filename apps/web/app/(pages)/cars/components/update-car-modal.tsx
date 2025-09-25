import React from 'react'
import EditCarForm from '~/app/(pages)/cars/components/edit-car-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Car } from '~/lib/types'

interface UpdateCarModalProps {
  car: Car | null,
  onOpenChange: () => void
  isOpen: boolean
}

const UpdateCarModal = ({ car, onOpenChange, isOpen }: UpdateCarModalProps) => {
  return (
    <Dialog open={!!isOpen} onOpenChange={isOpen => !isOpen && onOpenChange()}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edytuj pojazd</DialogTitle>
            <DialogDescription>Zaktualizuj dane wybranego pojazdu.</DialogDescription>
          </DialogHeader>
          {isOpen && car && <EditCarForm onSuccess={onOpenChange} initialData={car} />}
        </DialogContent>
      </Dialog>
  )
}

export default UpdateCarModal