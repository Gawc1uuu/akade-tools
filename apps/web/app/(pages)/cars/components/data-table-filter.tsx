import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import useDebounce from '~/hooks/use-debounce';

export interface FilterOptions {
  value: string;
  label: string;
}

export interface FilterConfig {
  type: 'select' | 'input';
  param: string;
  placeholder: string;
  options?: FilterOptions[];
}

interface DataTableFilterProps {
  filters: FilterConfig[];
}

const DataTableFilter = ({ filters }: DataTableFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const [inputValues, setInputValues] = useState(() => {
    const initialState: Record<string, string> = {};
    filters
      .filter(f => f.type === 'input')
      .forEach(filter => {
        const value = searchParams.get(filter.param);
        if (value) {
          initialState[filter.param] = value;
        }
      });
    return initialState;
  });

  const debouncedSearchTerm = useDebounce(inputValues, 500);

  const handleInputFilterChange = (param: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleFilterChange = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    filters.forEach(filter => params.delete(filter.param));
    push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let hasChanged = false;
    Object.entries(debouncedSearchTerm).forEach(([param, value]) => {
      const currentValue = searchParams.get(param) || '';
      if (currentValue !== value) {
        if (value) {
          params.set(param, value);
        } else {
          params.delete(param);
        }
        hasChanged = true;
      }
    });

    if (hasChanged) {
      push(`${pathname}?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, searchParams]);

  return (
    <div>
      <div>
        <div>
          {filters
            .filter(f => f.type === 'select')
            .map(filter => (
              <div key={filter.param}>
                <Select value={searchParams.get(filter.param) || ''} onValueChange={value => handleFilterChange(filter.param, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options &&
                      filter.options.map(option => (
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
          <Button onClick={handleClearFilters}>Wyczyść Filtry</Button>
        </div>
      </div>
      <div>
        {filters
          .filter(f => f.type === 'input')
          .map(filter => (
            <div key={filter.param}>
              <Input
                type="text"
                placeholder={filter.placeholder}
                value={inputValues[filter.param] || ''}
                onChange={e => handleInputFilterChange(filter.param, e.target.value)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default DataTableFilter;
