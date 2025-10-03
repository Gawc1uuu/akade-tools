import React from 'react';
import AddWorkerForm from '~/app/(pages)/staff/components/add-worker-form';

const AddWorker = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <div>
      <AddWorkerForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default AddWorker;
