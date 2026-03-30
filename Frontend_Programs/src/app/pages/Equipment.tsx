import { useState } from 'react';
import { Microscope, Plus, Edit2, Trash2, ClipboardList, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewToggle } from '../components/ViewToggle';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { useAuth, EditorAuthModal } from '../components/RoleBasedAuth';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

interface Equipment {
  serialNumber: string;
  name: string;
  cost: number;
  department: string;
  supplier: string;
}

interface Assignment {
  assignmentId: number;
  serialNumber: string;
  employeeId: string;
  equipmentName: string;
  scientistName: string;
  assignmentDate: string;
}

const departments = [
  'Molecular Biology',
  'Biochemistry',
  'Genetics',
  'Immunology',
  'Microbiology',
  'Neuroscience',
];

const suppliers = [
  'BioTech Solutions',
  'LabSupply Co.',
  'Scientific Supplies Inc.',
  'ChemLab Direct',
  'MedTech Equipment',
  'Global Lab Resources',
];

const initialEquipment: Equipment[] = [
  {
    serialNumber: 'EQ-001',
    name: 'Advanced Spectrophotometer',
    cost: 45000,
    department: 'Biochemistry',
    supplier: 'BioTech Solutions',
  },
  {
    serialNumber: 'EQ-002',
    name: 'PCR Thermal Cycler',
    cost: 28500,
    department: 'Molecular Biology',
    supplier: 'LabSupply Co.',
  },
  {
    serialNumber: 'EQ-003',
    name: 'Centrifuge X-200',
    cost: 15000,
    department: 'Genetics',
    supplier: 'Scientific Supplies Inc.',
  },
  {
    serialNumber: 'EQ-004',
    name: 'Microscope Elite Pro',
    cost: 52000,
    department: 'Microbiology',
    supplier: 'MedTech Equipment',
  },
  {
    serialNumber: 'EQ-005',
    name: 'Autoclave Pro-Max',
    cost: 18000,
    department: 'Microbiology',
    supplier: 'ChemLab Direct',
  },
  {
    serialNumber: 'EQ-006',
    name: 'Flow Cytometer',
    cost: 95000,
    department: 'Immunology',
    supplier: 'BioTech Solutions',
  },
  {
    serialNumber: 'EQ-007',
    name: 'Gel Electrophoresis System',
    cost: 8500,
    department: 'Molecular Biology',
    supplier: 'LabSupply Co.',
  },
  {
    serialNumber: 'EQ-008',
    name: 'Incubator CO2',
    cost: 12000,
    department: 'Genetics',
    supplier: 'Global Lab Resources',
  },
];

const initialAssignments: Assignment[] = [
  {
    assignmentId: 1,
    serialNumber: 'EQ-001',
    employeeId: 'EMP001',
    equipmentName: 'Advanced Spectrophotometer',
    scientistName: 'Dr. Sarah Chen',
    assignmentDate: '2026-03-15',
  },
  {
    assignmentId: 2,
    serialNumber: 'EQ-002',
    employeeId: 'EMP002',
    equipmentName: 'PCR Thermal Cycler',
    scientistName: 'Dr. Michael Ross',
    assignmentDate: '2026-03-18',
  },
  {
    assignmentId: 3,
    serialNumber: 'EQ-004',
    employeeId: 'EMP003',
    equipmentName: 'Microscope Elite Pro',
    scientistName: 'Dr. Emily Watson',
    assignmentDate: '2026-03-20',
  },
  {
    assignmentId: 4,
    serialNumber: 'EQ-006',
    employeeId: 'EMP004',
    equipmentName: 'Flow Cytometer',
    scientistName: 'Dr. James Park',
    assignmentDate: '2026-03-22',
  },
  {
    assignmentId: 5,
    serialNumber: 'EQ-003',
    employeeId: 'EMP005',
    equipmentName: 'Centrifuge X-200',
    scientistName: 'Dr. Lisa Martinez',
    assignmentDate: '2026-03-25',
  },
];

const scientists = [
  { employeeId: 'EMP001', name: 'Dr. Sarah Chen' },
  { employeeId: 'EMP002', name: 'Dr. Michael Ross' },
  { employeeId: 'EMP003', name: 'Dr. Emily Watson' },
  { employeeId: 'EMP004', name: 'Dr. James Park' },
  { employeeId: 'EMP005', name: 'Dr. Lisa Martinez' },
  { employeeId: 'EMP006', name: 'Dr. David Kim' },
  { employeeId: 'EMP007', name: 'Dr. Rachel Green' },
  { employeeId: 'EMP008', name: 'Dr. Thomas Anderson' },
];

const ITEMS_PER_PAGE = 6;

export default function Equipment() {
  const { role, isAdmin, isEditor, isViewer } = useAuth();
  const [activeTab, setActiveTab] = useState<'inventory' | 'assignments'>('inventory');
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditorAuthOpen, setIsEditorAuthOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'edit' | 'delete';
    item: Equipment | Assignment;
    context: 'equipment' | 'assignment';
  } | null>(null);
  const [formData, setFormData] = useState<Equipment>({
    serialNumber: '',
    name: '',
    cost: 0,
    department: departments[0],
    supplier: suppliers[0],
  });
  const [assignmentFormData, setAssignmentFormData] = useState<{
    serialNumber: string;
    employeeId: string;
    assignmentDate: string;
  }>({
    serialNumber: initialEquipment[0]?.serialNumber || '',
    employeeId: scientists[0]?.employeeId || '',
    assignmentDate: new Date().toISOString().split('T')[0],
  });

  const totalPages =
    activeTab === 'inventory'
      ? Math.ceil(equipment.length / ITEMS_PER_PAGE)
      : Math.ceil(assignments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEquipment = equipment.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentAssignments = assignments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      setEquipment(equipment.map((eq) => (eq.serialNumber === formData.serialNumber ? formData : eq)));
    } else {
      setEquipment([...equipment, formData]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setFormData({
      serialNumber: '',
      name: '',
      cost: 0,
      department: departments[0],
      supplier: suppliers[0],
    });
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEquipment = equipment.find((eq) => eq.serialNumber === assignmentFormData.serialNumber);
    const selectedScientist = scientists.find((sci) => sci.employeeId === assignmentFormData.employeeId);

    if (isEditMode && pendingAction?.item) {
      const assignment = pendingAction.item as Assignment;
      setAssignments(
        assignments.map((a) =>
          a.assignmentId === assignment.assignmentId
            ? {
                ...assignment,
                serialNumber: assignmentFormData.serialNumber,
                employeeId: assignmentFormData.employeeId,
                equipmentName: selectedEquipment?.name || '',
                scientistName: selectedScientist?.name || '',
                assignmentDate: assignmentFormData.assignmentDate,
              }
            : a
        )
      );
    } else {
      const newAssignment: Assignment = {
        assignmentId: Math.max(...assignments.map((a) => a.assignmentId), 0) + 1,
        serialNumber: assignmentFormData.serialNumber,
        employeeId: assignmentFormData.employeeId,
        equipmentName: selectedEquipment?.name || '',
        scientistName: selectedScientist?.name || '',
        assignmentDate: assignmentFormData.assignmentDate,
      };
      setAssignments([...assignments, newAssignment]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setAssignmentFormData({
      serialNumber: initialEquipment[0]?.serialNumber || '',
      employeeId: scientists[0]?.employeeId || '',
      assignmentDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleEditRequest = (item: Equipment | Assignment, context: 'equipment' | 'assignment') => {
    if (isAdmin()) {
      // Admin can edit directly without PIN
      if (context === 'equipment') {
        setFormData(item as Equipment);
      } else {
        const assignment = item as Assignment;
        setAssignmentFormData({
          serialNumber: assignment.serialNumber,
          employeeId: assignment.employeeId,
          assignmentDate: assignment.assignmentDate,
        });
      }
      setIsEditMode(true);
      setIsModalOpen(true);
    } else if (isEditor()) {
      // Editor needs PIN authentication
      setPendingAction({ type: 'edit', item, context });
      setIsEditorAuthOpen(true);
    }
  };

  const handleDeleteRequest = (item: Equipment | Assignment, context: 'equipment' | 'assignment') => {
    // Store the item to delete
    setPendingAction({ type: 'delete', item, context });
    
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
      if (pendingAction.context === 'equipment') {
        setFormData(pendingAction.item as Equipment);
      } else {
        const assignment = pendingAction.item as Assignment;
        setAssignmentFormData({
          serialNumber: assignment.serialNumber,
          employeeId: assignment.employeeId,
          assignmentDate: assignment.assignmentDate,
        });
      }
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

    if (pendingAction.context === 'equipment') {
      setEquipment(equipment.filter((eq) => eq.serialNumber !== (pendingAction.item as Equipment).serialNumber));
    } else {
      setAssignments(assignments.filter((a) => a.assignmentId !== (pendingAction.item as Assignment).assignmentId));
    }

    setIsDeleteConfirmOpen(false);
    setPendingAction(null);
  };

  const canModify = isAdmin() || isEditor();

  const setNow = () => {
    setAssignmentFormData({
      ...assignmentFormData,
      assignmentDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-card-foreground mb-2">Equipment Management</h2>
        <p className="text-muted-foreground">Manage laboratory equipment and assignments</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-border">
        <button
          onClick={() => {
            setActiveTab('inventory');
            setCurrentPage(1);
          }}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
            activeTab === 'inventory'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-card-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Microscope className="w-4 h-4" />
            Equipment Inventory
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTab('assignments');
            setCurrentPage(1);
          }}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
            activeTab === 'assignments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-card-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Equipment Assignments
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <ViewToggle currentView={view} onViewChange={setView} />
        </div>
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
            {activeTab === 'inventory' ? 'Add Equipment' : 'Add Assignment'}
          </button>
        )}
      </div>

      {/* Equipment Inventory Tab */}
      {activeTab === 'inventory' && (
        <>
          {view === 'card' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEquipment.map((item, index) => (
                  <motion.div
                    key={item.serialNumber}
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
                        <Microscope className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                        {item.serialNumber}
                      </span>
                    </div>

                    <h4 className="text-card-foreground mb-2">{item.name}</h4>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-accent font-medium">KSh {item.cost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="text-card-foreground">{item.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Supplier:</span>
                        <span className="text-card-foreground">{item.supplier}</span>
                      </div>
                    </div>

                    {canModify && (
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <button
                          onClick={() => handleEditRequest(item, 'equipment')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                                   bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30
                                   text-primary hover:from-primary/30 hover:to-accent/30 
                                   transition-all duration-300 hover:scale-105"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span className="text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(item, 'equipment')}
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
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Serial Number
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Name</th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Cost</th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Department
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Supplier</th>
                        {canModify && (
                          <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-primary">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentEquipment.map((item, index) => (
                        <motion.tr
                          key={item.serialNumber}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-border/50 hover:bg-gradient-to-r hover:from-primary/10 
                                   hover:via-primary/5 hover:to-transparent transition-all duration-300 
                                   group cursor-pointer relative overflow-hidden"
                        >
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-card-foreground group-hover:text-primary 
                                           transition-colors duration-300"
                            >
                              {item.serialNumber}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-card-foreground 
                                           group-hover:translate-x-1 inline-block transition-transform duration-300"
                            >
                              {item.name}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-accent group-hover:scale-110 inline-block
                                           transition-transform duration-300"
                            >
                              KSh {item.cost.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-muted-foreground group-hover:text-card-foreground 
                                           transition-colors duration-300"
                            >
                              {item.department}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-muted-foreground group-hover:text-primary 
                                           transition-colors duration-300"
                            >
                              {item.supplier}
                            </span>
                          </td>
                          {canModify && (
                            <td className="py-4 px-6 relative">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditRequest(item, 'equipment')}
                                  className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary
                                         hover:bg-primary/30 hover:scale-110 transition-all duration-300"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRequest(item, 'equipment')}
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
        </>
      )}

      {/* Equipment Assignments Tab - Similar structure with conditional rendering of canModify */}
      {activeTab === 'assignments' && (
        <>
          {view === 'card' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAssignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.assignmentId}
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
                        <ClipboardList className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                        #{assignment.assignmentId}
                      </span>
                    </div>

                    <h4 className="text-card-foreground mb-1">{assignment.equipmentName}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.scientistName}</p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{assignment.assignmentDate}</span>
                      </div>
                    </div>

                    {canModify && (
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <button
                          onClick={() => handleEditRequest(assignment, 'assignment')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                                   bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30
                                   text-primary hover:from-primary/30 hover:to-accent/30 
                                   transition-all duration-300 hover:scale-105"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span className="text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(assignment, 'assignment')}
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
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Assignment ID
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Equipment Name
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Scientist Name
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Assignment Date
                        </th>
                        {canModify && (
                          <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-primary">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentAssignments.map((assignment, index) => (
                        <motion.tr
                          key={assignment.assignmentId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-border/50 hover:bg-gradient-to-r hover:from-primary/10 
                                   hover:via-primary/5 hover:to-transparent transition-all duration-300 
                                   group cursor-pointer relative overflow-hidden"
                        >
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-card-foreground group-hover:text-primary 
                                           transition-colors duration-300"
                            >
                              #{assignment.assignmentId}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-card-foreground 
                                           group-hover:translate-x-1 inline-block transition-transform duration-300"
                            >
                              {assignment.equipmentName}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-muted-foreground group-hover:text-card-foreground 
                                           transition-colors duration-300"
                            >
                              {assignment.scientistName}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-muted-foreground group-hover:text-primary 
                                           transition-colors duration-300"
                            >
                              {assignment.assignmentDate}
                            </span>
                          </td>
                          {canModify && (
                            <td className="py-4 px-6 relative">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditRequest(assignment, 'assignment')}
                                  className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary
                                         hover:bg-primary/30 hover:scale-110 transition-all duration-300"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRequest(assignment, 'assignment')}
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
        </>
      )}

      {/* Equipment Modal */}
      {activeTab === 'inventory' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setFormData({
              serialNumber: '',
              name: '',
              cost: 0,
              department: departments[0],
              supplier: suppliers[0],
            });
          }}
          title={isEditMode ? 'Edit Equipment' : 'Add Equipment'}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Serial Number
              </label>
              <input
                type="text"
                required
                disabled={isEditMode}
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., EQ-009"
              />
            </div>

            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Equipment Name
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
                placeholder="Enter equipment name"
              />
            </div>

            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Cost (KSh)
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.cost || ''}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50"
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label
                  className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                                transition-colors duration-300"
                >
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                <label
                  className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                                transition-colors duration-300"
                >
                  Supplier
                </label>
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                           border-2 border-border rounded-lg text-card-foreground 
                           focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                           hover:border-primary/50 transition-all duration-300 cursor-pointer"
                >
                  {suppliers.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>
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
                    serialNumber: '',
                    name: '',
                    cost: 0,
                    department: departments[0],
                    supplier: suppliers[0],
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
      )}

      {/* Assignment Modal */}
      {activeTab === 'assignments' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setAssignmentFormData({
              serialNumber: initialEquipment[0]?.serialNumber || '',
              employeeId: scientists[0]?.employeeId || '',
              assignmentDate: new Date().toISOString().split('T')[0],
            });
          }}
          title={isEditMode ? 'Edit Assignment' : 'Add Assignment'}
        >
          <form onSubmit={handleAssignmentSubmit} className="space-y-5">
            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Equipment
              </label>
              <select
                value={assignmentFormData.serialNumber}
                onChange={(e) => setAssignmentFormData({ ...assignmentFormData, serialNumber: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                {equipment.map((eq) => (
                  <option key={eq.serialNumber} value={eq.serialNumber}>
                    {eq.serialNumber} - {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Scientist
              </label>
              <select
                value={assignmentFormData.employeeId}
                onChange={(e) => setAssignmentFormData({ ...assignmentFormData, employeeId: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                {scientists.map((sci) => (
                  <option key={sci.employeeId} value={sci.employeeId}>
                    {sci.employeeId} - {sci.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Assignment Date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  required
                  value={assignmentFormData.assignmentDate}
                  onChange={(e) => setAssignmentFormData({ ...assignmentFormData, assignmentDate: e.target.value })}
                  className="flex-1 px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                           border-2 border-border rounded-lg text-card-foreground 
                           focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                           hover:border-primary/50 transition-all duration-300 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={setNow}
                  className="px-4 py-3 rounded-lg bg-accent/20 border-2 border-accent/30 text-accent
                           hover:bg-accent/30 transition-all duration-300 whitespace-nowrap font-medium"
                >
                  Set Now
                </button>
              </div>
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
                  setAssignmentFormData({
                    serialNumber: initialEquipment[0]?.serialNumber || '',
                    employeeId: scientists[0]?.employeeId || '',
                    assignmentDate: new Date().toISOString().split('T')[0],
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
      )}

      {/* Editor Authentication Modal */}
      <EditorAuthModal
        isOpen={isEditorAuthOpen}
        onClose={() => {
          setIsEditorAuthOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleEditorAuthSuccess}
        action={pendingAction?.type || 'edit'}
        itemName={
          pendingAction?.context === 'equipment'
            ? (pendingAction.item as Equipment).name
            : (pendingAction?.item as Assignment)?.equipmentName
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPendingAction(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={
          pendingAction?.context === 'equipment'
            ? (pendingAction.item as Equipment).name
            : (pendingAction?.item as Assignment)?.equipmentName
        }
        itemType={pendingAction?.context === 'equipment' ? 'equipment' : 'assignment'}
      />
    </div>
  );
}