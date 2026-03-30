import { useState } from 'react';
import { Users, Mail, Phone, Briefcase, Plus, User, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewToggle } from '../components/ViewToggle';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { useAuth, EditorAuthModal } from '../components/RoleBasedAuth';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

interface Scientist {
  employeeId: string;
  name: string;
  age: number;
  department: string;
  specialization: string;
  gender: string;
  email: string;
  phone: string;
}

const departments = [
  'Molecular Biology',
  'Biochemistry',
  'Genetics',
  'Immunology',
  'Microbiology',
  'Neuroscience',
];

const specializationsByDepartment: Record<string, string[]> = {
  'Molecular Biology': ['DNA Sequencing', 'Gene Expression', 'Protein Synthesis'],
  'Biochemistry': ['Enzymology', 'Metabolism', 'Clinical Chemistry'],
  'Genetics': ['Population Genetics', 'Genomics', 'Genetic Engineering'],
  'Immunology': ['Cellular Immunology', 'Immunotherapy', 'Vaccine Development'],
  'Microbiology': ['Virology', 'Bacteriology', 'Mycology'],
  'Neuroscience': ['Cognitive Neuroscience', 'Neurophysiology', 'Behavioral Neuroscience'],
};

const initialScientists: Scientist[] = [
  {
    employeeId: 'EMP001',
    name: 'Dr. Sarah Chen',
    age: 34,
    department: 'Molecular Biology',
    specialization: 'DNA Sequencing',
    gender: 'Female',
    email: 's.chen@labflow.com',
    phone: '+1 (555) 123-4567',
  },
  {
    employeeId: 'EMP002',
    name: 'Dr. Michael Ross',
    age: 42,
    department: 'Biochemistry',
    specialization: 'Enzymology',
    gender: 'Male',
    email: 'm.ross@labflow.com',
    phone: '+1 (555) 234-5678',
  },
  {
    employeeId: 'EMP003',
    name: 'Dr. Emily Watson',
    age: 29,
    department: 'Genetics',
    specialization: 'Genomics',
    gender: 'Female',
    email: 'e.watson@labflow.com',
    phone: '+1 (555) 345-6789',
  },
  {
    employeeId: 'EMP004',
    name: 'Dr. James Park',
    age: 38,
    department: 'Immunology',
    specialization: 'Immunotherapy',
    gender: 'Male',
    email: 'j.park@labflow.com',
    phone: '+1 (555) 456-7890',
  },
  {
    employeeId: 'EMP005',
    name: 'Dr. Lisa Martinez',
    age: 31,
    department: 'Microbiology',
    specialization: 'Virology',
    gender: 'Female',
    email: 'l.martinez@labflow.com',
    phone: '+1 (555) 567-8901',
  },
  {
    employeeId: 'EMP006',
    name: 'Dr. David Kim',
    age: 45,
    department: 'Neuroscience',
    specialization: 'Neurophysiology',
    gender: 'Male',
    email: 'd.kim@labflow.com',
    phone: '+1 (555) 678-9012',
  },
];

const ITEMS_PER_PAGE = 6;

export default function Scientists() {
  const { isAdmin, isEditor, isViewer } = useAuth();
  const [scientists, setScientists] = useState<Scientist[]>(initialScientists);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditorAuthOpen, setIsEditorAuthOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'edit' | 'delete';
    item: Scientist;
  } | null>(null);
  const [formData, setFormData] = useState<Scientist>({
    employeeId: '',
    name: '',
    age: 0,
    department: departments[0],
    specialization: specializationsByDepartment[departments[0]][0],
    gender: 'Male',
    email: '',
    phone: '',
  });

  const totalPages = Math.ceil(scientists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentScientists = scientists.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      setScientists(scientists.map((s) => (s.employeeId === formData.employeeId ? formData : s)));
    } else {
      setScientists([...scientists, formData]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setFormData({
      employeeId: '',
      name: '',
      age: 0,
      department: departments[0],
      specialization: specializationsByDepartment[departments[0]][0],
      gender: 'Male',
      email: '',
      phone: '',
    });
  };

  const handleEditRequest = (scientist: Scientist) => {
    if (isAdmin()) {
      // Admin can edit directly without PIN
      setFormData(scientist);
      setIsEditMode(true);
      setIsModalOpen(true);
    } else if (isEditor()) {
      // Editor needs PIN authentication
      setPendingAction({ type: 'edit', item: scientist });
      setIsEditorAuthOpen(true);
    }
  };

  const handleDeleteRequest = (scientist: Scientist) => {
    // Store the item to delete
    setPendingAction({ type: 'delete', item: scientist });

    if (isAdmin()) {
      // Admin: Show confirmation directly
      setIsDeleteConfirmOpen(true);
    } else if (isEditor()) {
      // Editor: Show PIN first
      setIsEditorAuthOpen(true);
    }
  };

  const handleEditorAuthSuccess = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'edit') {
      setFormData(pendingAction.item);
      setIsEditMode(true);
      setIsModalOpen(true);
      setPendingAction(null);
    } else if (pendingAction.type === 'delete') {
      // Editor authenticated, now show delete confirmation
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!pendingAction) return;
    setScientists(scientists.filter((s) => s.employeeId !== pendingAction.item.employeeId));
    setIsDeleteConfirmOpen(false);
    setPendingAction(null);
  };

  const canModify = isAdmin() || isEditor();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-card-foreground mb-2">Scientists Management</h2>
        <p className="text-muted-foreground">Manage laboratory research scientists and their profiles</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <ViewToggle currentView={view} onViewChange={setView} />
        {canModify && (
          <button
            onClick={() => {
              setIsEditMode(false);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground
                     hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20
                     hover:shadow-primary/30 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Scientist
          </button>
        )}
      </div>

      {view === 'card' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentScientists.map((scientist, index) => (
              <motion.div
                key={scientist.employeeId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 
                         transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20
                                group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300"
                  >
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                    {scientist.employeeId}
                  </span>
                </div>

                <h4 className="text-card-foreground mb-1">{scientist.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {scientist.specialization} • {scientist.age} years
                </p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>{scientist.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="truncate">{scientist.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{scientist.phone}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="text-card-foreground font-medium">{scientist.gender}</span>
                  </div>
                </div>

                {canModify && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => handleEditRequest(scientist)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                               bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30
                               text-primary hover:from-primary/30 hover:to-accent/30 
                               transition-all duration-300 hover:scale-105"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span className="text-xs">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(scientist)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                               bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30
                               text-red-400 hover:from-red-500/30 hover:to-red-600/30 
                               transition-all duration-300 hover:scale-105"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="text-xs">Delete</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <div
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl overflow-hidden
                      shadow-xl shadow-primary/5"
        >
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <table className="w-full">
                <thead
                  className="sticky top-0 bg-gradient-to-r from-secondary via-secondary to-secondary/80 
                                backdrop-blur-sm border-b-2 border-primary/30 z-10"
                >
                  <tr>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">ID</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Name</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Age</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Department</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                      Specialization
                    </th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Email</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Gender</th>
                    {canModify && (
                      <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-primary">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentScientists.map((scientist, index) => (
                    <motion.tr
                      key={scientist.employeeId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-gradient-to-r hover:from-primary/10 
                               hover:via-primary/5 hover:to-transparent transition-all duration-300 
                               group cursor-pointer relative overflow-hidden"
                    >
                      <td className="py-4 px-6 relative">
                        <span className="relative text-sm text-card-foreground group-hover:text-primary transition-colors duration-300">
                          {scientist.employeeId}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span
                          className="relative text-sm text-card-foreground 
                                       group-hover:translate-x-1 inline-block transition-transform duration-300"
                        >
                          {scientist.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span className="relative text-sm text-muted-foreground">{scientist.age}</span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span
                          className="relative text-sm text-muted-foreground group-hover:text-card-foreground 
                                       transition-colors duration-300"
                        >
                          {scientist.department}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span
                          className="relative text-sm text-muted-foreground group-hover:text-primary 
                                       transition-colors duration-300"
                        >
                          {scientist.specialization}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span className="relative text-sm text-muted-foreground">{scientist.email}</span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span className="relative text-sm text-muted-foreground">{scientist.gender}</span>
                      </td>
                      {canModify && (
                        <td className="py-4 px-6 relative">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditRequest(scientist)}
                              className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary
                                     hover:bg-primary/30 hover:scale-110 transition-all duration-300"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(scientist)}
                              className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400
                                     hover:bg-red-500/30 hover:scale-110 transition-all duration-300"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-border bg-secondary/30">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setFormData({
            employeeId: '',
            name: '',
            age: 0,
            department: departments[0],
            specialization: specializationsByDepartment[departments[0]][0],
            gender: 'Male',
            email: '',
            phone: '',
          });
        }}
        title={isEditMode ? 'Edit Scientist' : 'Add Scientist'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Employee ID
              </label>
              <input
                type="text"
                required
                disabled={isEditMode}
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., EMP007"
              />
            </div>
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50"
                placeholder="Dr. John Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Age
              </label>
              <input
                type="number"
                required
                min="18"
                max="100"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50"
                placeholder="30"
              />
            </div>
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => {
                  const newDept = e.target.value;
                  setFormData({
                    ...formData,
                    department: newDept,
                    specialization: specializationsByDepartment[newDept][0],
                  });
                }}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Specialization
              </label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                {specializationsByDepartment[formData.department].map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                       border-2 border-border rounded-lg text-card-foreground 
                       focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                       hover:border-primary/50 transition-all duration-300 
                       placeholder:text-muted-foreground/50"
              placeholder="scientist@labflow.com"
            />
          </div>

          <div className="group">
            <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                       border-2 border-border rounded-lg text-card-foreground 
                       focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                       hover:border-primary/50 transition-all duration-300 
                       placeholder:text-muted-foreground/50"
              placeholder="+1 (555) 123-4567"
            />
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
              {isEditMode ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setFormData({
                  employeeId: '',
                  name: '',
                  age: 0,
                  department: departments[0],
                  specialization: specializationsByDepartment[departments[0]][0],
                  gender: 'Male',
                  email: '',
                  phone: '',
                });
              }}
              className="flex-1 px-6 py-3 rounded-lg bg-secondary text-card-foreground
                       border-2 border-border hover:border-primary/50 hover:bg-secondary/80 
                       transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Editor Authentication Modal */}
      <EditorAuthModal
        isOpen={isEditorAuthOpen}
        onClose={() => {
          setIsEditorAuthOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleEditorAuthSuccess}
        action={pendingAction?.type || 'edit'}
        itemName={pendingAction?.item?.name}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPendingAction(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={pendingAction?.item?.name || ''}
        itemType="scientist"
      />
    </div>
  );
}