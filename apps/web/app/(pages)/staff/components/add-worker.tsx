import React from 'react';
import AddWorkerForm from '~/app/(pages)/staff/components/add-worker-form';

const AddWorker = ({ onSuccess, setIsOpen }: { onSuccess: () => void; setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <div>
      <AddWorkerForm onSuccess={onSuccess}  setIsOpen={setIsOpen} />
    </div>
  );
};

export default AddWorker;
