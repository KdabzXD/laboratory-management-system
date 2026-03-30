import { Settings, Bell, ChevronDown, Shield, User, UserCheck } from 'lucide-react';
import { useAuth, RoleSelectionModal } from './RoleBasedAuth';
import { useState } from 'react';

export function Header() {
  const { role, setRole } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleConfig = {
    admin: {
      label: 'Admin',
      icon: Shield,
      color: 'from-accent to-primary',
      textColor: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    editor: {
      label: 'Editor',
      icon: UserCheck,
      color: 'from-primary to-accent',
      textColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    viewer: {
      label: 'Viewer',
      icon: User,
      color: 'from-muted-foreground/50 to-muted-foreground/30',
      textColor: 'text-muted-foreground',
      bgColor: 'bg-muted-foreground/10',
    },
  };

  const currentRoleConfig = roleConfig[role];
  const RoleIcon = currentRoleConfig.icon;

  const handleRoleChange = (newRole: typeof role) => {
    setRole(newRole);
  };

  return (
    <>
      <header className="h-24 bg-gradient-to-r from-card via-card to-card/95 border-b-2 border-border/50 
                       sticky top-0 z-50 backdrop-blur-md bg-card/90 shadow-lg shadow-black/5">
        <div className="h-full px-8 flex items-center justify-between max-w-[1920px] mx-auto gap-8">
          {/* Left Section - Title */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent 
                          flex items-center justify-center shadow-lg shadow-primary/20">
              <div className="text-2xl font-bold text-primary-foreground">L</div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground tracking-tight">
                Laboratory Management System
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Advanced Research & Development Platform
              </p>
            </div>
          </div>
          
          {/* Right Section - Actions & User */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Role Selector */}
            <button
              onClick={() => setShowRoleModal(true)}
              className={`flex items-center gap-3 px-5 py-3 rounded-lg ${currentRoleConfig.bgColor} 
                       border-2 border-border hover:border-primary/50 transition-all duration-300 
                       hover:scale-[1.02] active:scale-[0.98] group`}
            >
              <RoleIcon className={`w-5 h-5 ${currentRoleConfig.textColor}`} />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Access Mode</div>
                <div className={`text-sm font-medium ${currentRoleConfig.textColor}`}>
                  {currentRoleConfig.label}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 ${currentRoleConfig.textColor} 
                                     group-hover:translate-y-0.5 transition-transform duration-300`} />
            </button>

            {/* Divider */}
            <div className="h-12 w-px bg-border"></div>

            {/* Notifications */}
            <button className="relative p-3 rounded-lg bg-secondary/50 hover:bg-secondary 
                             border border-border/50 hover:border-primary/50 
                             transition-all duration-300 hover:scale-110 group">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full 
                             border-2 border-card animate-pulse"></span>
            </button>
            
            {/* Settings */}
            <button className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary 
                             border border-border/50 hover:border-primary/50 
                             transition-all duration-300 hover:scale-110 hover:rotate-90 group">
              <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-300" />
            </button>

            {/* Divider */}
            <div className="h-12 w-px bg-border"></div>
            
            {/* User Profile */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-lg 
                         bg-secondary/50 hover:bg-secondary border border-border/50 
                         hover:border-primary/50 transition-all duration-300 
                         hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary via-accent to-primary 
                              flex items-center justify-center shadow-lg shadow-primary/20 
                              ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <span className="text-sm font-bold text-primary-foreground">DA</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-card-foreground">Dr. Anderson</p>
                  <p className="text-xs text-muted-foreground">Senior Researcher</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground 
                                      group-hover:translate-y-0.5 transition-transform duration-300" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border-2 border-border rounded-lg 
                              shadow-xl shadow-black/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-border bg-secondary/30">
                    <p className="text-sm font-medium text-card-foreground">Dr. Anderson</p>
                    <p className="text-xs text-muted-foreground">anderson@lab.research.com</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full px-3 py-2 text-left text-sm text-card-foreground 
                                     hover:bg-secondary rounded-lg transition-colors duration-200">
                      Profile Settings
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-card-foreground 
                                     hover:bg-secondary rounded-lg transition-colors duration-200">
                      Preferences
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-red-400 
                                     hover:bg-red-500/10 rounded-lg transition-colors duration-200">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRole={role}
        onRoleChange={handleRoleChange}
      />
    </>
  );
}