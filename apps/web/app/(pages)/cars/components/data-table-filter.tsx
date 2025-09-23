import { usePathname, useSearchParams,useRouter } from 'next/navigation';
import React from 'react'
import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

export interface FilterOptions{
    value:string;
    label:string;
}

export interface FilterConfig {
    param:string;
    placeholder:string;
    options:FilterOptions[]
}

interface DataTableFilterProps {
    filters:FilterConfig[]
}

const DataTableFilter = ({filters}:DataTableFilterProps) => {
    const searchParams = useSearchParams()
    const pathname = usePathname();
    const {push} = useRouter();

    const handleFilterChange = (param:string,value:string) =>{
        const params = new URLSearchParams(searchParams)
        if(value){
            params.set(param,value)
        }else {
            params.delete(param)
        }
        push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    const handleClearFilters = ()=>{
        const params = new URLSearchParams(searchParams)
        filters.forEach(filter => params.delete(filter.param))
        push(`${pathname}?${params.toString()}`, { scroll: false });
    }

  return (
    <div>
        <div>
            {filters.map(filter =>(
                <div key={filter.param}>
                    <Select value={searchParams.get(filter.param) || ''} onValueChange={(value)=>handleFilterChange(filter.param, value)}>
                        <SelectTrigger>
                            <SelectValue placeholder={filter.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {filter.options.map(option=>(
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
        </div>
        <div>
            <Button onClick={handleClearFilters}>
                Wyczyść Filtry
            </Button>
        </div>
    </div>
  )
}

export default DataTableFilter