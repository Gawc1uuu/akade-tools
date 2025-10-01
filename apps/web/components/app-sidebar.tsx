'use client';

import * as React from 'react';
import { CarIcon, Users } from 'lucide-react';

import { NavMain } from '~/components/nav-main';
import { NavUser } from '~/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '~/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from '../public/akade-logo.png';
import { Session } from '~/lib/types';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Samochody',
      url: '/cars',
      icon: CarIcon,
    },
    {
      title: 'Pracownicy',
      url: '/staff',
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & { session: Session; handleLogout: () => void }) {
  const pathname = usePathname();
  const dynamicNavMain = data.navMain.map(item => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="relative h-16 w-full overflow-hidden rounded-md">
          <Image src={Logo} alt="Logo" fill className="object-fill" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dynamicNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.session} handleLogout={props.handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
