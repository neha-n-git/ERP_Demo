import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, CreditCard, LifeBuoy, FileText, Building } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Startups', path: '/admin/startups', icon: Building2 },
  { name: 'People Registry', path: '/admin/people', icon: Users },
  { name: 'Resources', path: '/admin/resources', icon: FileText },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Support', path: '/admin/support', icon: LifeBuoy },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-primary text-white flex flex-col shadow-xl z-20 h-full">
      <div className="p-6 flex justify-center items-center border-b border-primary-light bg-primary">
         <Building className="h-8 w-8 text-white mr-2" />
         <span className="font-bold text-white text-lg">Demo Incubator</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-light text-white shadow-sm'
                    : 'text-gray-300 hover:bg-primary-light/50 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-primary-light text-xs text-center text-gray-400">
        Demo Incubation System<br/>v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;
