import React from 'react';
import { 
  LayoutDashboard, 
  Swords, 
  Columns, 
  Trophy, 
  Settings as SettingsIcon, 
  HelpCircle,
  Menu,
  X,
  Home as HomeIcon,
  BarChart3,
  History as HistoryIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './UI';

export type DashboardView = 'home' | 'battle' | 'side-by-side' | 'leaderboard' | 'stats' | 'history' | 'settings';

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'battle', label: 'Battle Mode', icon: Swords },
  { id: 'side-by-side', label: 'Side-by-Side', icon: Columns },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'stats', label: 'System Stats', icon: BarChart3 },
  { id: 'history', label: 'Chat History', icon: HistoryIcon },
] as const;

export default function Sidebar({ activeView, onViewChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out border-r bg-white border-gray-100 shadow-2xl lg:shadow-none",
        isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0",
        "lg:static"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 flex items-center justify-between">
            <div className={cn("flex items-center gap-3 overflow-hidden transition-opacity", !isOpen && "lg:opacity-0")}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-black text-white">
                <LayoutDashboard size={18} />
              </div>
              <span className="font-bold tracking-tight whitespace-nowrap text-gray-900">HRouter</span>
            </div>
            <button 
              onClick={onToggle}
              className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                  activeView === item.id 
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={20} className={cn(
                  "shrink-0 transition-transform",
                  activeView === item.id ? "" : "group-hover:scale-110"
                )} />
                <span className={cn(
                  "font-medium whitespace-nowrap transition-opacity duration-200",
                  !isOpen && "lg:opacity-0 lg:pointer-events-none"
                )}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 space-y-2 border-t border-gray-50">
            <button 
              onClick={() => onViewChange('settings')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                activeView === 'settings' 
                  ? "bg-black text-white shadow-lg shadow-black/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <SettingsIcon size={20} className={cn(
                "shrink-0 transition-transform",
                activeView === 'settings' ? "" : "group-hover:scale-110"
              )} />
              <span className={cn(
                "font-medium whitespace-nowrap transition-opacity duration-200",
                !isOpen && "lg:opacity-0 lg:pointer-events-none"
              )}>
                Settings
              </span>
            </button>
            <div className="pt-4 mt-2 border-t border-gray-50">
              <div className={cn("flex items-center gap-3 px-3 py-2", !isOpen && "justify-center")}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-gray-900 text-white">
                  JD
                </div>
                <div className={cn("flex flex-col overflow-hidden transition-opacity", !isOpen && "lg:opacity-0 lg:w-0")}>
                  <span className="text-sm font-bold truncate text-gray-900">John Doe</span>
                  <span className="text-[10px] text-gray-500 truncate">Pro Plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
