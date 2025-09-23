import React from 'react'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { User } from '~/lib/types'

interface DataTableFiltersProps {
  makes?: string[];
  users?: User[];
}

const DataTableFilters = ({ makes, users }: DataTableFiltersProps) => {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();

  const handleMakeChange = (make: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('make', make);
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOwnerChange = (owner: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('owner', owner);
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('make');
    params.delete('owner')
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <div>
        <div>
        <Label>Marka</Label>
        <Select value={searchParams.get('make') || ''} onValueChange={handleMakeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz markę" />
          </SelectTrigger>
          <SelectContent>
            {makes?.map((make) => (
              <SelectItem key={make} value={make}>{make}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
        <div>
          <Label>Dodane przez</Label>
          <Select value={searchParams.get('owner') || ''} onValueChange={handleOwnerChange}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz użytkownika" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>{user.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Button variant="outline" onClick={handleClearFilters}>
          Wyczyść filtry
        </Button>
      </div>
    </div>
  )
}

export default DataTableFilters