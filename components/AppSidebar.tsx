import React from "react"
import {
  ChevronUp,
  MessageCircle,
  User2,
  ClipboardList,
  LayoutGrid,
  ShieldAlert,
  Sparkles,
  Settings
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "./blocks/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { UserRole } from "../types"

interface AppSidebarProps {
  activeRole: UserRole;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onRoleChange: (role: UserRole) => void;
}

export function AppSidebar({ activeRole, activeTab, onTabChange, onRoleChange }: AppSidebarProps) {
  const caregiverItems = [
    { title: "Tasks", id: 'tasks', icon: ClipboardList },
    { title: "Ask Me", id: 'copilot', icon: Sparkles },
    { title: "Profile", id: 'profile', icon: User2 },
  ]

  const familyItems = [
    { title: "Timeline", id: 'timeline', icon: LayoutGrid },
    { title: "Messages", id: 'messages', icon: MessageCircle },
    { title: "Care Team", id: 'care-team', icon: ShieldAlert },
  ]

  const items = activeRole === UserRole.CAREGIVER ? caregiverItems : familyItems;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> 
                  <span>{activeRole === UserRole.CAREGIVER ? 'Caregiver' : 'Family'}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => onRoleChange(UserRole.CAREGIVER)}>
                  <span>Switch to Caregiver</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRoleChange(UserRole.FAMILY)}>
                  <span>Switch to Family</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}