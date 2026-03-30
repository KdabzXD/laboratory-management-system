import { createContext, useContext, useState, ReactNode } from 'react';
import { Modal } from './Modal';
import { Shield, User, UserCheck, Lock } from 'lucide-react';

type Role = 'viewer' | 'editor' | 'admin';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  authenticateAdmin: (pin: string) => boolean;
  authenticateEditor: (pin: string) => boolean;
  requireEditorAuth: (callback: () => void) => void;
  isAdmin: () => boolean;
  isEditor: () => boolean;
  isViewer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PIN = '12345678';
const EDITOR_PIN = '87654321';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window === 'undefined') return 'viewer';
    const saved = localStorage.getItem('labflow_role') as Role | null;
    return saved === 'admin' || saved === 'editor' || saved === 'viewer' ? saved : 'viewer';
  }); // Default to viewer

  const authenticateAdmin = (pin: string): boolean => {
    return pin === ADMIN_PIN;
  };

  const authenticateEditor = (pin: string): boolean => {
    return pin === EDITOR_PIN;
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('labflow_role', newRole);
      if (newRole !== 'editor') {
        localStorage.removeItem('labflow_editor_pin');
      }
    }
  };

  const requireEditorAuth = (callback: () => void) => {
    // This will be handled by the component that uses it
    callback();
  };

  const isAdmin = () => role === 'admin';
  const isEditor = () => role === 'editor';
  const isViewer = () => role === 'viewer';

  return (
    <AuthContext.Provider value={{ 
      role, 
      setRole, 
      authenticateAdmin, 
      authenticateEditor,
      requireEditorAuth,
      isAdmin,
      isEditor,
      isViewer
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSelectionModal({ isOpen, onClose, currentRole, onRoleChange }: RoleSelectionModalProps) {
  const { authenticateAdmin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError('');
    
    if (role === 'admin') {
      setShowPinInput(true);
    } else {
      // Viewer and Editor don't need PIN to switch to that mode
      setShowPinInput(false);
    }
  };

  const handleConfirm = () => {
    if (selectedRole === 'admin') {
      if (!pin) {
        setError('Please enter the admin PIN');
        return;
      }
      if (!authenticateAdmin(pin)) {
        setError('Incorrect PIN. Please try again.');
        setPin('');
        return;
      }
    }

    onRoleChange(selectedRole);
    setPin('');
    setError('');
    setShowPinInput(false);
    onClose();
  };

  const handleClose = () => {
    setSelectedRole(currentRole);
    setPin('');
    setError('');
    setShowPinInput(false);
    onClose();
  };

  const roles = [
    {
      value: 'viewer' as Role,
      label: 'Viewer',
      icon: User,
      description: 'Read-only access to all pages',
      color: 'from-muted-foreground/20 to-muted-foreground/10',
      textColor: 'text-muted-foreground',
      borderColor: 'border-muted-foreground/30',
    },
    {
      value: 'editor' as Role,
      label: 'Editor',
      icon: UserCheck,
      description: 'Can edit and delete with PIN verification',
      color: 'from-primary/30 to-accent/30',
      textColor: 'text-primary',
      borderColor: 'border-primary/30',
    },
    {
      value: 'admin' as Role,
      label: 'Admin',
      icon: Shield,
      description: 'Full access without restrictions',
      color: 'from-accent/30 to-primary/30',
      textColor: 'text-accent',
      borderColor: 'border-accent/30',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Select Access Mode">
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground text-center">
          Choose your access mode for this session
        </p>

        {/* Role Options */}
        <div className="space-y-3">
          {roles.map((roleOption) => {
            const Icon = roleOption.icon;
            const isSelected = selectedRole === roleOption.value;
            
            return (
              <button
                key={roleOption.value}
                onClick={() => handleRoleSelect(roleOption.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left
                         ${isSelected 
                           ? `bg-gradient-to-r ${roleOption.color} ${roleOption.borderColor} scale-[1.02]` 
                           : 'bg-secondary/30 border-border hover:border-primary/50'
                         }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? roleOption.textColor : 'text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${isSelected ? roleOption.textColor : 'text-card-foreground'}`}>
                        {roleOption.label}
                      </span>
                      {roleOption.value === 'admin' && (
                        <Lock className="w-3 h-3 text-accent" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{roleOption.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* PIN Input for Admin */}
        {showPinInput && selectedRole === 'admin' && (
          <div className="space-y-3 p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-accent">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Admin Authentication Required</span>
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                       border-2 border-border rounded-lg text-card-foreground text-center
                       tracking-widest text-lg
                       focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                       hover:border-primary/50 transition-all duration-300 
                       placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:text-sm"
              placeholder="Enter admin PIN"
              maxLength={8}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent 
                     text-primary-foreground hover:from-primary/90 hover:to-accent/90 
                     transition-all duration-300 shadow-lg shadow-primary/30 
                     hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]
                     active:scale-[0.98] font-medium"
          >
            Confirm
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 rounded-lg bg-secondary text-card-foreground
                     border-2 border-border hover:border-primary/50 hover:bg-secondary/80 
                     transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Editor PIN Authentication Modal
interface EditorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  action: 'edit' | 'delete';
  itemName?: string;
}

export function EditorAuthModal({ isOpen, onClose, onSuccess, action, itemName }: EditorAuthModalProps) {
  const { authenticateEditor } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticateEditor(pin)) {
      setError('Incorrect PIN. Please try again.');
      setPin('');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('labflow_editor_pin', pin);
    }

    setPin('');
    setError('');
    onSuccess();
    onClose();
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editor Authentication">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 
                        flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Please enter your PIN to {action} {itemName ? `"${itemName}"` : 'this item'}
          </p>
        </div>

        <div className="group">
          <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                          transition-colors duration-300">Editor PIN</label>
          <input
            type="password"
            required
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                     border-2 border-border rounded-lg text-card-foreground text-center
                     tracking-widest text-xl
                     focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                     hover:border-primary/50 transition-all duration-300 
                     placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:text-base"
            placeholder="Enter 8-digit PIN"
            maxLength={8}
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent 
                     text-primary-foreground hover:from-primary/90 hover:to-accent/90 
                     transition-all duration-300 shadow-lg shadow-primary/30 
                     hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]
                     active:scale-[0.98] font-medium"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-6 py-3 rounded-lg bg-secondary text-card-foreground
                     border-2 border-border hover:border-primary/50 hover:bg-secondary/80 
                     transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
