import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  Microscope, 
  FlaskConical, 
  Building2, 
  ShoppingCart,
  FileBarChart
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/scientists', label: 'Scientists', icon: Users },
  { path: '/equipment', label: 'Equipment', icon: Microscope },
  { path: '/materials', label: 'Materials', icon: FlaskConical },
  { path: '/suppliers', label: 'Suppliers', icon: Building2 },
  { path: '/purchases', label: 'Purchases', icon: ShoppingCart },
  { path: '/queries-reports', label: 'Queries & Reports', icon: FileBarChart },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Microscope className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sidebar-foreground">LabFlow</h2>
            <p className="text-xs text-muted-foreground">Lab Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-xs text-muted-foreground mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-sm text-sidebar-foreground">All Systems Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}