import { useEffect, useMemo, useState } from 'react';
import { Building2, Mail, Phone, MapPin, Plus, Edit2, Trash2, Search, ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewToggle } from '../components/ViewToggle';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { useAuth, EditorAuthModal } from '../components/RoleBasedAuth';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { apiDelete, apiGet, apiPost, apiPut } from '../api/client';

interface Supplier {
  supplierId: number;
  name: string;
  address: string;
  location: string;
  description: string;
  email: string;
  contact: string;
}

interface SupplierApi {
  supplier_id: number;
  supplier_name: string;
  supplier_address: string;
  supplier_location: string;
  supplier_description: string;
  supplier_email: string;
  supplier_contact: string;
}

const initialSuppliers: Supplier[] = [
  {
    supplierId: 1,
    name: 'BioTech Solutions',
    address: '123 Science Park',
    location: 'Boston, MA 02134',
    description: 'Leading provider of molecular biology and biotechnology equipment',
    email: 'contact@biotech-solutions.com',
    contact: '+1 (555) 111-2222',
  },
  {
    supplierId: 2,
    name: 'LabSupply Co.',
    address: '456 Research Drive',
    location: 'San Francisco, CA 94158',
    description: 'Premium laboratory supplies and equipment',
    email: 'info@labsupply.com',
    contact: '+1 (555) 222-3333',
  },
  {
    supplierId: 3,
    name: 'Scientific Supplies Inc.',
    address: '789 Innovation Blvd',
    location: 'Cambridge, MA 02139',
    description: 'Comprehensive scientific equipment and consumables',
    email: 'sales@scisupplies.com',
    contact: '+1 (555) 333-4444',
  },
  {
    supplierId: 4,
    name: 'ChemLab Direct',
    address: '321 Chemistry Way',
    location: 'Chicago, IL 60607',
    description: 'Chemical reagents and laboratory supplies specialist',
    email: 'support@chemlabdirect.com',
    contact: '+1 (555) 444-5555',
  },
  {
    supplierId: 5,
    name: 'MedTech Equipment',
    address: '654 Medical Plaza',
    location: 'Seattle, WA 98101',
    description: 'Medical and laboratory equipment provider',
    email: 'contact@medtechequip.com',
    contact: '+1 (555) 555-6666',
  },
  {
    supplierId: 6,
    name: 'Global Lab Resources',
    address: '987 International Court',
    location: 'New York, NY 10004',
    description: 'Worldwide laboratory supplies and equipment distributor',
    email: 'info@globallabresources.com',
    contact: '+1 (555) 666-7777',
  },
];

const ITEMS_PER_PAGE = 6;

export default function Suppliers() {
  const { isAdmin, isEditor } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditorAuthOpen, setIsEditorAuthOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'edit' | 'delete';
    item: Supplier;
  } | null>(null);
  const [formData, setFormData] = useState<Supplier>({
    supplierId: 0,
    name: '',
    address: '',
    location: '',
    description: '',
    email: '',
    contact: '',
  });

  const loadSuppliers = async () => {
    const rows = await apiGet<SupplierApi[]>('/suppliers');
    setSuppliers(
      rows.map((row) => ({
        supplierId: row.supplier_id,
        name: row.supplier_name,
        address: row.supplier_address,
        location: row.supplier_location,
        description: row.supplier_description,
        email: row.supplier_email,
        contact: row.supplier_contact,
      }))
    );
  };

  useEffect(() => {
    loadSuppliers().catch((error) => {
      console.error('Failed to load suppliers:', error);
    });
  }, []);

  const visibleSuppliers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return suppliers
      .filter((supplier) =>
        [
          supplier.supplierId,
          supplier.name,
          supplier.address,
          supplier.location,
          supplier.description,
          supplier.email,
          supplier.contact,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
      .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  }, [searchQuery, sortAsc, suppliers]);

  const totalPages = Math.max(1, Math.ceil(visibleSuppliers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSuppliers = visibleSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await apiPut<{ message: string }>(`/suppliers/${formData.supplierId}`, {
          supplier_name: formData.name,
          supplier_address: formData.address,
          supplier_location: formData.location,
          supplier_description: formData.description,
          supplier_email: formData.email,
          supplier_contact: formData.contact,
        });
      } else {
        await apiPost<{ message: string }>('/suppliers', {
          supplier_name: formData.name,
          supplier_address: formData.address,
          supplier_location: formData.location,
          supplier_description: formData.description,
          supplier_email: formData.email,
          supplier_contact: formData.contact,
        });
      }
      await loadSuppliers();
      setIsModalOpen(false);
      setIsEditMode(false);
      setFormData({
        supplierId: 0,
        name: '',
        address: '',
        location: '',
        description: '',
        email: '',
        contact: '',
      });
    } catch (error: any) {
      alert(error?.message || 'Failed to save supplier.');
    }
  };

  const handleEditRequest = (supplier: Supplier) => {
    if (isAdmin()) {
      setFormData(supplier);
      setIsEditMode(true);
      setIsModalOpen(true);
    } else if (isEditor()) {
      setPendingAction({ type: 'edit', item: supplier });
      setIsEditorAuthOpen(true);
    }
  };

  const handleDeleteRequest = (supplier: Supplier) => {
    setPendingAction({ type: 'delete', item: supplier });

    if (isAdmin()) {
      setIsDeleteConfirmOpen(true);
    } else if (isEditor()) {
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
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pendingAction) return;
    try {
      await apiDelete<{ message: string }>(`/suppliers/${pendingAction.item.supplierId}`);
      await loadSuppliers();
      setIsDeleteConfirmOpen(false);
      setPendingAction(null);
    } catch (error: any) {
      alert(error?.message || 'Failed to delete supplier.');
    }
  };

  const canModify = isAdmin();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-card-foreground mb-2">Suppliers Management</h2>
        <p className="text-muted-foreground">Manage laboratory equipment and material suppliers</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <ViewToggle currentView={view} onViewChange={setView} />
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search suppliers..."
              className="w-full pl-11 pr-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 border-2 border-border rounded-lg text-card-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-primary/50 transition-all duration-300 placeholder:text-muted-foreground/50"
            />
          </div>
          <button
            onClick={() => setSortAsc((value) => !value)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary border-2 border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="text-sm">{sortAsc ? 'A-Z' : 'Z-A'}</span>
          </button>
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
            Add Supplier
          </button>
        )}
      </div>

      {view === 'card' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSuppliers.map((supplier, index) => (
              <motion.div
                key={supplier.supplierId}
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
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                    #{supplier.supplierId}
                  </span>
                </div>

                <h4 className="text-card-foreground mb-2">{supplier.name}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{supplier.description}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="truncate">{supplier.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{supplier.contact}</span>
                  </div>
                </div>

                {canModify && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => handleEditRequest(supplier)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                               bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30
                               text-primary hover:from-primary/30 hover:to-accent/30 
                               transition-all duration-300 hover:scale-105"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span className="text-xs">Edit</span>
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
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Supplier ID</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Name</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Address</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Location</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Description</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Email</th>
                    <th className="text-left py-4 px-6 text-sm uppercase tracking-wider text-primary">Contact</th>
                    {canModify && (
                      <th className="text-center py-4 px-6 text-sm uppercase tracking-wider text-primary">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentSuppliers.map((supplier, index) => (
                    <motion.tr
                      key={supplier.supplierId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-gradient-to-r hover:from-primary/10 
                               hover:via-primary/5 hover:to-transparent transition-all duration-300 
                               group cursor-pointer relative overflow-hidden"
                    >
                      <td className="py-4 px-6 relative">
                        <span className="relative text-sm text-card-foreground group-hover:text-primary transition-colors duration-300">
                          #{supplier.supplierId}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span
                          className="relative text-sm text-card-foreground 
                                       group-hover:translate-x-1 inline-block transition-transform duration-300"
                        >
                          {supplier.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span
                          className="relative text-sm text-muted-foreground group-hover:text-card-foreground 
                                       transition-colors duration-300"
                        >
                          {supplier.address}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span
                          className="relative text-sm text-muted-foreground group-hover:text-card-foreground 
                                       transition-colors duration-300"
                        >
                          {supplier.location}
                        </span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span className="relative text-sm text-muted-foreground line-clamp-2">{supplier.description}</span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span className="relative text-sm text-muted-foreground">{supplier.email}</span>
                      </td>
                      <td className="py-4 px-6 relative">
                        <span
                          className="relative text-sm text-muted-foreground group-hover:text-primary 
                                       transition-colors duration-300"
                        >
                          {supplier.contact}
                        </span>
                      </td>
                      {canModify && (
                        <td className="py-4 px-6 relative">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditRequest(supplier)}
                              className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary
                                     hover:bg-primary/30 hover:scale-110 transition-all duration-300"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
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
            supplierId: 0,
            name: '',
            address: '',
            location: '',
            description: '',
            email: '',
            contact: '',
          });
        }}
        title={isEditMode ? 'Edit Supplier' : 'Add Supplier'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
              Supplier Name
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
              placeholder="e.g., Karibu Lab Supplies"
            />
          </div>

          <div className="group">
            <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
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
              placeholder="e.g., Lab equipment"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50"
                placeholder="e.g., Nairobi Rd"
              />
            </div>
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50"
                placeholder="e.g., Nairobi"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                placeholder="e.g., karibu@labs.co.ke"
              />
            </div>
            <div className="group">
              <label className="block text-sm text-muted-foreground mb-2 group-focus-within:text-primary transition-colors duration-300">
                Contact Number
              </label>
              <input
                type="tel"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-4 py-3 bg-gradient-to-br from-secondary to-secondary/80 
                         border-2 border-border rounded-lg text-card-foreground 
                         focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                         hover:border-primary/50 transition-all duration-300 
                         placeholder:text-muted-foreground/50"
                placeholder="e.g., 0712345678"
              />
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
                  supplierId: 0,
                  name: '',
                  address: '',
                  location: '',
                  description: '',
                  email: '',
                  contact: '',
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
        itemType="supplier"
      />
    </div>
  );
}
