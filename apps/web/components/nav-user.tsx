'use client';

import { ChevronsUpDown, LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~/components/ui/sidebar';
import { Session } from '~/lib/types';

export function NavUser({ user, handleLogout }: { user: Session; handleLogout: () => void }) {
  const { isMobile, state } = useSidebar();

  return (
    <SidebarMenu className="border border-gray-500 rounded-md bg-gray-900 text-white hover:bg-gray-900/80 hover:cursor-pointer">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gray-900/50 data-[state=open]:text-white hover:text-white hover:cursor-pointer"
            >
              {state === 'collapsed' && !isMobile ? (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              ) : (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-gray-900 text-white border border-gray-500 border-2"
            side={isMobile ? 'bottom' : state === 'collapsed' ? 'right' : 'top'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-gray-500/50 hover:cursor-pointer focus:bg-gray-500/50 focus:text-white [&_svg]:text-white">
              <LogOut className="text-white" onClick={handleLogout} />
              Wyloguj się
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
