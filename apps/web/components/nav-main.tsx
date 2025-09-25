'use client';

import { ChevronDown, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {

  const pathname = usePathname();

  return (
    <SidebarGroup className="px-0 mt-6 font-sans">
      <SidebarMenu className="space-y-1">
        {items.map(item => {
          const hasSubItems = item.items && item.items.length > 0;

          return hasSubItems ? (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild 
                >
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                  'text-base text-xl gap-x-3 py-6 px-4 [&>svg]:h-7 [&>svg]:w-7',
                  'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>svg]:size-10',
                  'active:bg-transparent active:text-primary-red',
                  {
                    'text-primary-red hover:text-primary-red-foreground hover:bg-none active:bg-none hover:text-primary-red-foreground':
                      item.isActive,
                  }
                )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map(subItem => {
                      const isActive = subItem.url === pathname;
                      return (<SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild
                        className={cn(
                          {
                            'bg-primary-red text-primary-red-foreground hover:bg-primary-red hover:text-primary-red-foreground active:bg-primary-red active:text-primary-red-foreground':
                              isActive,
                          },
                        )}
                        >
                          <Link href={subItem.url} >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>)
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title} className="flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn(
                  'text-base text-xl gap-x-3 py-6 px-4 [&>svg]:h-7 [&>svg]:w-7',
                  'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>svg]:size-10',
                  'active:bg-transparent active:text-primary-red',
                  {
                    'bg-primary-red text-primary-red-foreground hover:bg-primary-red hover:text-primary-red-foreground active:bg-primary-red active:text-primary-red-foreground':
                      item.isActive,
                  }
                )}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
