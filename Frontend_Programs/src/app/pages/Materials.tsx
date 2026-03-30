import { useState } from 'react';
import { FlaskConical, Package, Plus, Edit2, Trash2, FileText, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewToggle } from '../components/ViewToggle';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { useAuth, EditorAuthModal } from '../components/RoleBasedAuth';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

interface Material {
  referenceNumber: string;
  materialName: string;
  description: string;
  supplier: string;
  cost: number;
}

interface MaterialRequest {
  requestId: number;
  materialName: string;
  scientistName: string;
  requestDate: string;
  quantity: number;
}

const suppliers = [
  'BioTech Solutions',
  'LabSupply Co.',
  'Scientific Supplies Inc.',
  'ChemLab Direct',
  'MedTech Equipment',
  'Global Lab Resources',
];

const initialMaterials: Material[] = [
  {
    referenceNumber: 'MAT001',
    materialName: 'DNA Extraction Kit',
    description: 'High-purity DNA extraction kit for molecular biology applications',
    supplier: 'BioTech Solutions',
    cost: 24500,
  },
  {
    referenceNumber: 'MAT002',
    materialName: 'Cell Culture Medium',
    description: 'DMEM with 10% FBS and antibiotics for cell culture',
    supplier: 'LabSupply Co.',
    cost: 8950,
  },
  {
    referenceNumber: 'MAT003',
    materialName: 'Pipette Tips (1000μL)',
    description: 'Sterile, filter tips for precise liquid handling',
    supplier: 'Scientific Supplies Inc.',
    cost: 4275,
  },
  {
    referenceNumber: 'MAT004',
    materialName: 'PCR Reagent Kit',
    description: 'Complete PCR amplification reagent set with polymerase',
    supplier: 'BioTech Solutions',
    cost: 18900,
  },
  {
    referenceNumber: 'MAT005',
    materialName: 'Microcentrifuge Tubes',
    description: '1.5mL sterile tubes for sample storage and centrifugation',
    supplier: 'LabSupply Co.',
    cost: 3150,
  },
  {
    referenceNumber: 'MAT006',
    materialName: 'Protein Assay Kit',
    description: 'Bradford protein quantification assay kit',
    supplier: 'ChemLab Direct',
    cost: 15600,
  },
];

const initialRequests: MaterialRequest[] = [
  {
    requestId: 1,
    materialName: 'DNA Extraction Kit',
    scientistName: 'Dr. Sarah Chen',
    requestDate: '2026-03-20',
    quantity: 5,
  },
  {
    requestId: 2,
    materialName: 'Cell Culture Medium',
    scientistName: 'Dr. Michael Ross',
    requestDate: '2026-03-22',
    quantity: 10,
  },
  {
    requestId: 3,
    materialName: 'PCR Reagent Kit',
    scientistName: 'Dr. Emily Watson',
    requestDate: '2026-03-24',
    quantity: 3,
  },
  {
    requestId: 4,
    materialName: 'Protein Assay Kit',
    scientistName: 'Dr. James Park',
    requestDate: '2026-03-25',
    quantity: 2,
  },
];

const scientists = [
  'Dr. Sarah Chen',
  'Dr. Michael Ross',
  'Dr. Emily Watson',
  'Dr. James Park',
  'Dr. Lisa Martinez',
  'Dr. David Kim',
];

const ITEMS_PER_PAGE = 6;

export default function Materials() {
  const { isAdmin, isEditor, isViewer } = useAuth();
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [requests, setRequests] = useState<MaterialRequest[]>(initialRequests);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditorAuthOpen, setIsEditorAuthOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'edit' | 'delete';
    item: Material | MaterialRequest;
    context: 'material' | 'request';
  } | null>(null);
  const [formData, setFormData] = useState<Material>({
    referenceNumber: '',
    materialName: '',
    description: '',
    supplier: suppliers[0],
    cost: 0,
  });
  const [requestFormData, setRequestFormData] = useState<{
    materialName: string;
    scientistName: string;
    requestDate: string;
    quantity: number;
  }>({
    materialName: initialMaterials[0]?.materialName || '',
    scientistName: scientists[0],
    requestDate: new Date().toISOString().split('T')[0],
    quantity: 1,
  });

  const totalPages =
    activeTab === 'inventory'
      ? Math.ceil(materials.length / ITEMS_PER_PAGE)
      : Math.ceil(requests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMaterials = materials.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentRequests = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      setMaterials(materials.map((m) => (m.referenceNumber === formData.referenceNumber ? formData : m)));
    } else {
      setMaterials([...materials, formData]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setFormData({
      referenceNumber: '',
      materialName: '',
      description: '',
      supplier: suppliers[0],
      cost: 0,
    });
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && pendingAction?.item) {
      const request = pendingAction.item as MaterialRequest;
      setRequests(
        requests.map((r) =>
          r.requestId === request.requestId
            ? {
                ...request,
                materialName: requestFormData.materialName,
                scientistName: requestFormData.scientistName,
                requestDate: requestFormData.requestDate,
                quantity: requestFormData.quantity,
              }
            : r
        )
      );
    } else {
      const newRequest: MaterialRequest = {
        requestId: Math.max(...requests.map((r) => r.requestId), 0) + 1,
        materialName: requestFormData.materialName,
        scientistName: requestFormData.scientistName,
        requestDate: requestFormData.requestDate,
        quantity: requestFormData.quantity,
      };
      setRequests([...requests, newRequest]);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setRequestFormData({
      materialName: initialMaterials[0]?.materialName || '',
      scientistName: scientists[0],
      requestDate: new Date().toISOString().split('T')[0],
      quantity: 1,
    });
  };

  const handleEditRequest = (item: Material | MaterialRequest, context: 'material' | 'request') => {
    if (isAdmin()) {
      if (context === 'material') {
        setFormData(item as Material);
      } else {
        const request = item as MaterialRequest;
        setRequestFormData({
          materialName: request.materialName,
          scientistName: request.scientistName,
          requestDate: request.requestDate,
          quantity: request.quantity,
        });
      }
      setIsEditMode(true);
      setIsModalOpen(true);
    } else if (isEditor()) {
      setPendingAction({ type: 'edit', item, context });
      setIsEditorAuthOpen(true);
    }
  };

  const handleDeleteRequest = (item: Material | MaterialRequest, context: 'material' | 'request') => {
    setPendingAction({ type: 'delete', item, context });

    if (isAdmin()) {
      setIsDeleteConfirmOpen(true);
    } else if (isEditor()) {
      setIsEditorAuthOpen(true);
    }
  };

  const handleEditorAuthSuccess = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'edit') {
      if (pendingAction.context === 'material') {
        setFormData(pendingAction.item as Material);
      } else {
        const request = pendingAction.item as MaterialRequest;
        setRequestFormData({
          materialName: request.materialName,
          scientistName: request.scientistName,
          requestDate: request.requestDate,
          quantity: request.quantity,
        });
      }
      setIsEditMode(true);
      setIsModalOpen(true);
      setPendingAction(null);
    } else if (pendingAction.type === 'delete') {
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!pendingAction) return;

    if (pendingAction.context === 'material') {
      setMaterials(materials.filter((m) => m.referenceNumber !== (pendingAction.item as Material).referenceNumber));
    } else {
      setRequests(requests.filter((r) => r.requestId !== (pendingAction.item as MaterialRequest).requestId));
    }

    setIsDeleteConfirmOpen(false);
    setPendingAction(null);
  };

  const canModify = isAdmin() || isEditor();

  const setNow = () => {
    setRequestFormData({
      ...requestFormData,
      requestDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-card-foreground mb-2">Materials Management</h2>
        <p className="text-muted-foreground">Manage laboratory materials inventory and requests</p>
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
            <FlaskConical className="w-4 h-4" />
            Materials Inventory
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTab('requests');
            setCurrentPage(1);
          }}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
            activeTab === 'requests'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-card-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Material Requests
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
            {activeTab === 'inventory' ? 'Add Material' : 'Add Request'}
          </button>
        )}
      </div>

      {/* Materials Inventory Tab */}
      {activeTab === 'inventory' && (
        <>
          {view === 'card' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentMaterials.map((material, index) => (
                  <motion.div
                    key={material.referenceNumber}
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
                        <FlaskConical className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                        {material.referenceNumber}
                      </span>
                    </div>

                    <h4 className="text-card-foreground mb-2">{material.materialName}</h4>

                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-muted-foreground line-clamp-2">{material.description}</p>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground">Supplier:</span>
                        <span className="text-card-foreground">{material.supplier}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="text-accent font-medium">KSh {material.cost.toLocaleString()}</span>
                      </div>
                    </div>

                    {canModify && (
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <button
                          onClick={() => handleEditRequest(material, 'material')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                                   bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30
                                   text-primary hover:from-primary/30 hover:to-accent/30 
                                   transition-all duration-300 hover:scale-105"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span className="text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(material, 'material')}
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
                          Reference #
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Material Name
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Supplier</th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Description
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Cost</th>
                        {canModify && (
                          <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-primary">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentMaterials.map((material, index) => (
                        <motion.tr
                          key={material.referenceNumber}
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
                              {material.referenceNumber}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-card-foreground 
                                           group-hover:translate-x-1 inline-block transition-transform duration-300"
                            >
                              {material.materialName}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-muted-foreground group-hover:text-primary 
                                           transition-colors duration-300"
                            >
                              {material.supplier}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span className="relative text-sm text-muted-foreground line-clamp-2">
                              {material.description}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-accent group-hover:scale-110 inline-block
                                           transition-transform duration-300"
                            >
                              KSh {material.cost.toLocaleString()}
                            </span>
                          </td>
                          {canModify && (
                            <td className="py-4 px-6 relative">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditRequest(material, 'material')}
                                  className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary
                                         hover:bg-primary/30 hover:scale-110 transition-all duration-300"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRequest(material, 'material')}
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

      {/* Material Requests Tab */}
      {activeTab === 'requests' && (
        <>
          {view === 'card' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRequests.map((request, index) => (
                  <motion.div
                    key={request.requestId}
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
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                        #{request.requestId}
                      </span>
                    </div>

                    <h4 className="text-card-foreground mb-1">{request.materialName}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{request.scientistName}</p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Quantity: {request.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{request.requestDate}</span>
                      </div>
                    </div>

                    {canModify && (
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <button
                          onClick={() => handleEditRequest(request, 'request')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                                   bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30
                                   text-primary hover:from-primary/30 hover:to-accent/30 
                                   transition-all duration-300 hover:scale-105"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span className="text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(request, 'request')}
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
                          Request ID
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Material Name
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Scientist
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Quantity
                        </th>
                        <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">
                          Request Date
                        </th>
                        {canModify && (
                          <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-primary">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentRequests.map((request, index) => (
                        <motion.tr
                          key={request.requestId}
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
                              #{request.requestId}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-card-foreground 
                                           group-hover:translate-x-1 inline-block transition-transform duration-300"
                            >
                              {request.materialName}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-muted-foreground group-hover:text-card-foreground 
                                           transition-colors duration-300"
                            >
                              {request.scientistName}
                            </span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span className="relative text-sm text-muted-foreground">{request.quantity}</span>
                          </td>
                          <td className="py-4 px-6 relative">
                            <span
                              className="relative text-sm text-muted-foreground group-hover:text-primary 
                                           transition-colors duration-300"
                            >
                              {request.requestDate}
                            </span>
                          </td>
                          {canModify && (
                            <td className="py-4 px-6 relative">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditRequest(request, 'request')}
                                  className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary
                                         hover:bg-primary/30 hover:scale-110 transition-all duration-300"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRequest(request, 'request')}
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

      {/* Material Modal */}
      {activeTab === 'inventory' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setFormData({
              referenceNumber: '',
              materialName: '',
              description: '',
              supplier: suppliers[0],
              cost: 0,
            });
          }}
          title={isEditMode ? 'Edit Material' : 'Add Material'}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Reference Number
              </label>
              <input
                type="text"
                required
                disabled={isEditMode}
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., MAT007"
              />
            </div>

            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Material Name
              </label>
              <input
                type="text"
                required
                value={formData.materialName}
                onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50"
                placeholder="Enter material name"
              />
            </div>

            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50 resize-none"
                placeholder="Describe the material..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    referenceNumber: '',
                    materialName: '',
                    description: '',
                    supplier: suppliers[0],
                    cost: 0,
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

      {/* Request Modal */}
      {activeTab === 'requests' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setRequestFormData({
              materialName: initialMaterials[0]?.materialName || '',
              scientistName: scientists[0],
              requestDate: new Date().toISOString().split('T')[0],
              quantity: 1,
            });
          }}
          title={isEditMode ? 'Edit Request' : 'Add Request'}
        >
          <form onSubmit={handleRequestSubmit} className="space-y-5">
            <div className="group">
              <label
                className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                              transition-colors duration-300"
              >
                Material
              </label>
              <select
                value={requestFormData.materialName}
                onChange={(e) => setRequestFormData({ ...requestFormData, materialName: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                {materials.map((mat) => (
                  <option key={mat.referenceNumber} value={mat.materialName}>
                    {mat.materialName}
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
                value={requestFormData.scientistName}
                onChange={(e) => setRequestFormData({ ...requestFormData, scientistName: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                {scientists.map((sci) => (
                  <option key={sci} value={sci}>
                    {sci}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label
                  className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                                transition-colors duration-300"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={requestFormData.quantity}
                  onChange={(e) => setRequestFormData({ ...requestFormData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                           border-2 border-border rounded-lg text-card-foreground 
                           focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                           hover:border-primary/50 transition-all duration-300 
                           placeholder:text-muted-foreground/50"
                  placeholder="1"
                />
              </div>
              <div className="group">
                <label
                  className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary 
                                transition-colors duration-300"
                >
                  Request Date
                </label>
                <input
                  type="date"
                  required
                  value={requestFormData.requestDate}
                  onChange={(e) => setRequestFormData({ ...requestFormData, requestDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                           border-2 border-border rounded-lg text-card-foreground 
                           focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                           hover:border-primary/50 transition-all duration-300 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={setNow}
              className="w-full px-4 py-2 rounded-lg bg-accent/20 border-2 border-accent/30 text-accent
                       hover:bg-accent/30 transition-all duration-300 text-sm font-medium"
            >
              Set to Today
            </button>

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
                  setRequestFormData({
                    materialName: initialMaterials[0]?.materialName || '',
                    scientistName: scientists[0],
                    requestDate: new Date().toISOString().split('T')[0],
                    quantity: 1,
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
          pendingAction?.context === 'material'
            ? (pendingAction.item as Material).materialName
            : (pendingAction?.item as MaterialRequest)?.materialName
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
          pendingAction?.context === 'material'
            ? (pendingAction.item as Material).materialName
            : (pendingAction?.item as MaterialRequest)?.materialName
        }
        itemType={pendingAction?.context === 'material' ? 'material' : 'request'}
      />
    </div>
  );
}