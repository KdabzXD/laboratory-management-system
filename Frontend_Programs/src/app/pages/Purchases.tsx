import { useEffect, useState } from 'react';
import { ShoppingCart, Calendar, Package, Plus, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { useAuth, EditorAuthModal } from '../components/RoleBasedAuth';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '../api/client';

interface Purchase {
  purchaseId: string;
  materialName: string;
  quantity: number;
  supplier: string;
  purchaseDate: string;
  totalCost: number;
  status: 'pending' | 'completed';
}

interface PurchaseApi {
  purchase_id: number;
  reference_number: string;
  material_name: string;
  material_quantity: number;
  supplier_id: number;
  supplier_name: string;
  purchase_date: string;
  status_id: number | null;
  status_name: string | null;
  total_cost: number;
}

interface MaterialApi {
  reference_number: string;
  material_name: string;
  material_cost?: number;
}

interface SupplierApi {
  supplier_id: number;
  supplier_name: string;
}

interface StatusTypeApi {
  status_id: number;
  status_name: string;
}

const materials = [
  'DNA Extraction Kit',
  'Cell Culture Medium',
  'Pipette Tips (1000μL)',
  'PCR Reagent Set',
  'Microcentrifuge Tubes',
  'Antibody Panel Set',
  'PCR Master Mix',
  'Gel Electrophoresis Kit',
];

const suppliers = [
  'BioTech Solutions',
  'LabSupply Co.',
  'Scientific Supplies Inc.',
  'ChemLab Direct',
  'MedTech Equipment',
  'Global Lab Resources',
];

const initialPurchases: Purchase[] = [
  {
    purchaseId: 'PO-2026-001',
    materialName: 'DNA Extraction Kit',
    quantity: 100,
    supplier: 'BioTech Solutions',
    purchaseDate: '2026-03-15',
    totalCost: 245000,
    status: 'pending',
  },
  {
    purchaseId: 'PO-2026-002',
    materialName: 'PCR Reagent Set',
    quantity: 50,
    supplier: 'LabSupply Co.',
    purchaseDate: '2026-03-18',
    totalCost: 142500,
    status: 'pending',
  },
  {
    purchaseId: 'PO-2026-003',
    materialName: 'Microcentrifuge Tubes',
    quantity: 200,
    supplier: 'Scientific Supplies Inc.',
    purchaseDate: '2026-03-20',
    totalCost: 63000,
    status: 'completed',
  },
  {
    purchaseId: 'PO-2026-004',
    materialName: 'Cell Culture Medium',
    quantity: 75,
    supplier: 'LabSupply Co.',
    purchaseDate: '2026-03-10',
    totalCost: 67125,
    status: 'completed',
  },
  {
    purchaseId: 'PO-2026-005',
    materialName: 'Antibody Panel Set',
    quantity: 25,
    supplier: 'BioTech Solutions',
    purchaseDate: '2026-03-23',
    totalCost: 125000,
    status: 'pending',
  },
  {
    purchaseId: 'PO-2026-006',
    materialName: 'Gel Electrophoresis Kit',
    quantity: 10,
    supplier: 'ChemLab Direct',
    purchaseDate: '2026-03-25',
    totalCost: 45000,
    status: 'completed',
  },
];

const ITEMS_PER_PAGE = 6;

export default function Purchases() {
  const { isAdmin, isEditor, isViewer } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [materialOptions, setMaterialOptions] = useState<string[]>(materials);
  const [supplierOptions, setSupplierOptions] = useState<string[]>(suppliers);
  const [materialsApi, setMaterialsApi] = useState<MaterialApi[]>([]);
  const [suppliersApi, setSuppliersApi] = useState<SupplierApi[]>([]);
  const [statusIds, setStatusIds] = useState<{ pending?: number; completed?: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditorAuthOpen, setIsEditorAuthOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'edit' | 'delete';
    item: Purchase;
  } | null>(null);
  const [formData, setFormData] = useState<Omit<Purchase, 'purchaseId' | 'status'>>({
    materialName: materials[0],
    quantity: 1,
    supplier: suppliers[0],
    purchaseDate: new Date().toISOString().split('T')[0],
    totalCost: 0,
  });

  const mapStatusName = (statusName: string | null): 'pending' | 'completed' => {
    return (statusName || '').toLowerCase().includes('complete') ? 'completed' : 'pending';
  };

  const loadPurchasesPage = async () => {
    const [purchaseRows, materialRows, supplierRows, statusRows] = await Promise.all([
      apiGet<PurchaseApi[]>('/purchases'),
      apiGet<MaterialApi[]>('/materials'),
      apiGet<SupplierApi[]>('/suppliers'),
      apiGet<StatusTypeApi[]>('/purchases/status-types'),
    ]);

    setMaterialsApi(materialRows);
    setSuppliersApi(supplierRows);
    setMaterialOptions(materialRows.map((m) => m.material_name));
    setSupplierOptions(supplierRows.map((s) => s.supplier_name));

    const nextStatusIds: { pending?: number; completed?: number } = {
      pending: statusRows.find((s) => s.status_name.toLowerCase().includes('pending'))?.status_id,
      completed: statusRows.find((s) => s.status_name.toLowerCase().includes('complete'))?.status_id,
    };

    // Safety fallback for environments with partial status data.
    if (!nextStatusIds.pending || !nextStatusIds.completed) {
      for (const row of purchaseRows) {
        const statusName = (row.status_name || '').toLowerCase();
        if (statusName.includes('pending') && row.status_id) {
          nextStatusIds.pending = row.status_id;
        }
        if (statusName.includes('complete') && row.status_id) {
          nextStatusIds.completed = row.status_id;
        }
      }
    }
    setStatusIds(nextStatusIds);

    setPurchases(
      purchaseRows.map((row) => ({
        purchaseId: String(row.purchase_id),
        materialName: row.material_name,
        quantity: Number(row.material_quantity || 0),
        supplier: row.supplier_name,
        purchaseDate: new Date(row.purchase_date).toISOString().split('T')[0],
        totalCost: Number(row.total_cost || 0),
        status: mapStatusName(row.status_name),
      }))
    );
  };

  useEffect(() => {
    loadPurchasesPage().catch((error) => {
      console.error('Failed to load purchases page data:', error);
    });
  }, []);

  useEffect(() => {
    const unitCost = Number(materialsApi.find((m) => m.material_name === formData.materialName)?.material_cost || 0);
    const quantity = Number(formData.quantity || 0);
    const nextTotal = unitCost * quantity;

    setFormData((prev) => {
      if (prev.totalCost === nextTotal) return prev;
      return { ...prev, totalCost: nextTotal };
    });
  }, [formData.materialName, formData.quantity, materialsApi]);

  const totalPages = Math.ceil(purchases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPurchases = purchases.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const pendingPurchases = purchases.filter((p) => p.status === 'pending');
  const completedPurchases = purchases.filter((p) => p.status === 'completed');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedMaterial = materialsApi.find((m) => m.material_name === formData.materialName);
      const selectedSupplier = suppliersApi.find((s) => s.supplier_name === formData.supplier);

      if (!selectedMaterial || !selectedSupplier) {
        throw new Error('Material or supplier mapping failed for purchase payload.');
      }

      if (isEditMode && pendingAction?.item) {
        await apiPut<{ message: string }>(`/purchases/${pendingAction.item.purchaseId}`, {
          reference_number: selectedMaterial.reference_number,
          material_quantity: Number(formData.quantity),
          supplier_id: selectedSupplier.supplier_id,
          purchase_date: formData.purchaseDate,
          status_id: pendingAction.item.status === 'completed' ? statusIds.completed : statusIds.pending,
        });
      } else {
        await apiPost<{ message: string }>('/purchases', {
          reference_number: selectedMaterial.reference_number,
          material_quantity: Number(formData.quantity),
          supplier_id: selectedSupplier.supplier_id,
          purchase_date: formData.purchaseDate,
          status_id: statusIds.pending,
        });
      }
      await loadPurchasesPage();
      setIsModalOpen(false);
      setIsEditMode(false);
      setFormData({
        materialName: materialOptions[0] || '',
        quantity: 1,
        supplier: supplierOptions[0] || '',
        purchaseDate: new Date().toISOString().split('T')[0],
        totalCost: 0,
      });
    } catch (error: any) {
      alert(error?.message || 'Failed to save purchase.');
    }
  };

  const handleEditRequest = (purchase: Purchase) => {
    if (isAdmin()) {
      setFormData({
        materialName: purchase.materialName,
        quantity: purchase.quantity,
        supplier: purchase.supplier,
        purchaseDate: purchase.purchaseDate,
        totalCost: purchase.totalCost,
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    } else if (isEditor()) {
      setPendingAction({ type: 'edit', item: purchase });
      setIsEditorAuthOpen(true);
    }
  };

  const handleDeleteRequest = (purchase: Purchase) => {
    setPendingAction({ type: 'delete', item: purchase });

    if (isAdmin()) {
      setIsDeleteConfirmOpen(true);
    } else if (isEditor()) {
      setIsEditorAuthOpen(true);
    }
  };

  const handleEditorAuthSuccess = () => {
    if (!pendingAction) return;

    if (pendingAction.type === 'edit') {
      setFormData({
        materialName: pendingAction.item.materialName,
        quantity: pendingAction.item.quantity,
        supplier: pendingAction.item.supplier,
        purchaseDate: pendingAction.item.purchaseDate,
        totalCost: pendingAction.item.totalCost,
      });
      setIsEditMode(true);
      setIsModalOpen(true);
      setPendingAction(null);
    } else if (pendingAction.type === 'delete') {
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pendingAction) return;
    try {
      await apiDelete<{ message: string }>(`/purchases/${pendingAction.item.purchaseId}`);
      await loadPurchasesPage();
      setIsDeleteConfirmOpen(false);
      setPendingAction(null);
    } catch (error: any) {
      alert(error?.message || 'Failed to delete purchase.');
    }
  };

  const handleStatusChange = async (purchaseId: string, nextStatus: 'pending' | 'completed') => {
    const current = purchases.find((p) => p.purchaseId === purchaseId);
    if (!current) return;

    if (current.status === nextStatus) {
      return;
    }

    const statusId = nextStatus === 'completed' ? statusIds.completed : statusIds.pending;
    if (!statusId) return;

    try {
      await apiPatch<{ message: string }>(`/purchases/${purchaseId}/status`, {
        status_id: statusId,
      });
      await loadPurchasesPage();
    } catch (error: any) {
      alert(error?.message || 'Failed to update purchase status.');
    }
  };

  const canModify = isAdmin() || isEditor();

  const setNow = () => {
    setFormData({
      ...formData,
      purchaseDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-card-foreground mb-2">Purchase Orders</h2>
        <p className="text-muted-foreground">Manage material purchase orders and track deliveries</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-xl p-6
                   hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Purchases</p>
              <p className="text-3xl font-bold text-card-foreground">{purchases.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-xl p-6
                   hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-yellow-400">{pendingPurchases.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-xl p-6
                   hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-400">{completedPurchases.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20">
              <Package className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-card-foreground">Recent Purchase Orders</h3>
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
            New Purchase Order
          </button>
        )}
      </div>

      {/* Purchases Table */}
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
                  <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Purchase ID</th>
                  <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Material</th>
                  <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Quantity</th>
                  <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Supplier</th>
                  <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Total Cost</th>
                  <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Date</th>
                  <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-primary">Status</th>
                  {canModify && (
                    <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-primary">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentPurchases.map((purchase, index) => (
                  <motion.tr
                    key={purchase.purchaseId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-gradient-to-r hover:from-primary/10 
                             hover:via-primary/5 hover:to-transparent transition-all duration-300 
                             group cursor-pointer relative overflow-hidden"
                  >
                    <td className="py-4 px-6 relative">
                      <span className="relative text-sm text-card-foreground group-hover:text-primary transition-colors duration-300">
                        {purchase.purchaseId}
                      </span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <span
                        className="relative text-sm text-card-foreground 
                                     group-hover:translate-x-1 inline-block transition-transform duration-300"
                      >
                        {purchase.materialName}
                      </span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <span className="relative text-sm text-muted-foreground">{purchase.quantity}</span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <span
                        className="relative text-sm text-muted-foreground group-hover:text-card-foreground 
                                     transition-colors duration-300"
                      >
                        {purchase.supplier}
                      </span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <span
                        className="relative text-sm text-accent group-hover:scale-110 inline-block
                                     transition-transform duration-300"
                      >
                        KSh {purchase.totalCost.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <span
                        className="relative text-sm text-muted-foreground group-hover:text-primary 
                                     transition-colors duration-300"
                      >
                        {purchase.purchaseDate}
                      </span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <div className="flex items-center justify-center">
                        <select
                          value={purchase.status}
                          onChange={(e) => handleStatusChange(purchase.purchaseId, e.target.value as 'pending' | 'completed')}
                          disabled={isViewer()}
                          title="Purchase Status"
                          className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 border ${
                            purchase.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                          } ${isViewer() ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </td>
                    {canModify && (
                      <td className="py-4 px-6 relative">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditRequest(purchase)}
                            className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary
                                   hover:bg-primary/30 hover:scale-110 transition-all duration-300"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(purchase)}
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setFormData({
            materialName: materialOptions[0] || '',
            quantity: 1,
            supplier: supplierOptions[0] || '',
            purchaseDate: new Date().toISOString().split('T')[0],
            totalCost: 0,
          });
        }}
        title={isEditMode ? 'Edit Purchase Order' : 'New Purchase Order'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Material
              </label>
              <select
                value={formData.materialName}
                onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                title="Material"
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                {materialOptions.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50"
                placeholder="1"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
              Supplier
            </label>
            <select
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              title="Supplier"
              className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                       border-2 border-border rounded-lg text-card-foreground 
                       focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                       hover:border-primary/50 transition-all duration-300 cursor-pointer"
            >
              {supplierOptions.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div>

          <div className="group">
            <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
              Total Cost (KSh)
            </label>
            <input
              type="number"
              readOnly
              value={formData.totalCost || ''}
              className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                       border-2 border-border rounded-lg text-card-foreground 
                       focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                       hover:border-primary/50 transition-all duration-300 cursor-not-allowed opacity-80
                       placeholder:text-muted-foreground/50"
              placeholder="0.00"
            />
          </div>

          <div className="group">
            <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
              Purchase Date
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                title="Purchase Date"
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
                Today
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
                setFormData({
                  materialName: materialOptions[0] || '',
                  quantity: 1,
                  supplier: supplierOptions[0] || '',
                  purchaseDate: new Date().toISOString().split('T')[0],
                  totalCost: 0,
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
        itemName={pendingAction?.item?.purchaseId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPendingAction(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={pendingAction?.item?.purchaseId || ''}
        itemType="purchase order"
      />
    </div>
  );
}
