import { useRouter } from "next/navigation"
import { startTransition, useActionState, useState } from "react"
import { deleteCar } from "~/app/actions/cars/delete-car";
import { Car } from "~/lib/types"

export const useCarActions = () => {
    const router = useRouter();

    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [deletingCarId, setDeletingCarId] = useState<string | null>(null);

    const [state, formAction, isPending] = useActionState(deleteCar, { success: false, deletedCar: null });

    const handleEdit = (car: Car) => {
        setEditingCar(car);
    }

    const handleCloseModal = () => {
        setEditingCar(null);
    }

    const handleDeletePrompt = (carId: string) => {
        setDeletingCarId(carId);
      };

   const handleCancelDelete = () => {
    setDeletingCarId(null);
   }

   const handleConfirmDelete = (carId: string) => {
    const formData = new FormData();
    formData.append('id', carId);
    startTransition(() => {
      formAction(formData);
      setDeletingCarId(null); 
    });
    router.refresh();
   }
    

   return {
    state,
    editingCar,
    deletingCarId,
    isPending,
    handleEdit,
    handleCloseModal,
    handleDeletePrompt,
    handleCancelDelete,
    handleConfirmDelete,
  };
  
}