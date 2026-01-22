"use client";

import { cn } from "@/lib/utils";

type SidebarItem = { id: string; label: string; disabled?: boolean; };

type ProfileSidebarProps = { items: readonly SidebarItem[]; activeId: string; onSelect: (id: string) => void; };

const ProfileSidebarItem = ({ item, isActive, onSelect, }: { item: SidebarItem; isActive: boolean; onSelect: (id: string) => void; }) => (

<li> <button type="button" disabled={item.disabled} onClick={() => onSelect(item.id)} className={cn( "group relative w-full px-6 py-4 text-left transition-all duration-300 overflow-hidden", isActive ? "bg-[#692d91] text-white" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50", item.disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer" )} > 
  {/* Active Indicator Line */} {isActive && ( <div className="absolute left-0 top-0 h-full w-1 bg-white/30" /> )}

  <div className="relative z-10 flex items-center justify-between">
    <span className={cn(
      "text-[11px] font-black uppercase tracking-[0.2em] ",
      isActive ? "translate-x-1" : "group-hover:translate-x-1"
    )}>
      {item.label}
    </span>
    
    {isActive && (
      <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
    )}
  </div>

  {/* Hover background effect */}
  {!isActive && !item.disabled && (
    <div className="absolute inset-0 bg-slate-100 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
  )}
</button>
</li> );

const ProfileSidebar = ({ items, activeId, onSelect }: ProfileSidebarProps) => (

<nav className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm"> 
  <ul className="flex flex-col"> {items.map((item, index) => ( <div key={item.id}> <ProfileSidebarItem item={item} isActive={item.id === activeId} onSelect={onSelect} /> {/* Separator line between items except last */} {index !== items.length - 1 && ( <div className="h-[1px] w-full bg-slate-50" /> )} </div> ))} </ul> </nav> );

export default ProfileSidebar;