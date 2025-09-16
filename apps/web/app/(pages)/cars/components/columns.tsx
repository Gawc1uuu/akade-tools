'use client';
import { Car } from "~/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ClientDate } from "~/app/(pages)/cars/components/client-date";


export const columns: ColumnDef<Car>[] = [
  {
    header: 'Marka',
    accessorKey: 'make',
  },
  {
    header: 'Model',
    accessorKey: 'model',
  },
  {
    header: 'Numer rejestracyjny',
    accessorKey: 'registrationNumber',
  },
  {
    header: 'Data ważności ubezpieczenia',
    accessorKey: 'insuranceEndDate',    
    cell: ({row}) => {
        const insuranceEndDate = row.getValue("insuranceEndDate") as string;
        return <ClientDate date={insuranceEndDate} />
    }
  },
  {
    header: 'Data ważności przeglądu',
    accessorKey: 'inspectionEndDate',
    cell: ({row}) => {
        const inspectionEndDate = row.getValue("inspectionEndDate") as string;
        return <ClientDate date={inspectionEndDate} />
    }
  },
  {
    header: 'Utworzono przez',
    accessorKey: 'createdBy',
  },
];