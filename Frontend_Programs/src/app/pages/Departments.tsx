import { useEffect, useMemo, useState } from 'react';
import { Building2, Layers3, Search, ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Pagination } from '../components/Pagination';
import { apiGet } from '../api/client';

interface Department {
  department_id: number;
  department_name: string;
}

interface Specialization {
  specialization_id: number;
  specialization_name: string;
  department_id: number;
}

interface ScientistMetadata {
  departments: Department[];
  specializations: Specialization[];
  genders: Array<{ gender_id: number; gender_name: string }>;
}

const ITEMS_PER_PAGE = 6;

export default function Departments() {
  const [activeTab, setActiveTab] = useState<'departments' | 'specializations'>('departments');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    apiGet<ScientistMetadata>('/scientists/metadata')
      .then((data) => {
        setDepartments(data.departments || []);
        setSpecializations(data.specializations || []);
      })
      .catch((error) => {
        console.error('Failed to load department data:', error);
      });
  }, []);

  const departmentNameById = useMemo(() => {
    return new Map(departments.map((department) => [department.department_id, department.department_name]));
  }, [departments]);

  const visibleDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return departments
      .filter((department) => department.department_name.toLowerCase().includes(query))
      .sort((a, b) =>
        sortAsc
          ? a.department_name.localeCompare(b.department_name)
          : b.department_name.localeCompare(a.department_name)
      );
  }, [departments, searchQuery, sortAsc]);

  const visibleSpecializations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return specializations
      .filter((specialization) => {
        const departmentName = departmentNameById.get(specialization.department_id) || '';
        return (
          specialization.specialization_name.toLowerCase().includes(query) ||
          departmentName.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aName = `${departmentNameById.get(a.department_id) || ''} ${a.specialization_name}`;
        const bName = `${departmentNameById.get(b.department_id) || ''} ${b.specialization_name}`;
        return sortAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
      });
  }, [departmentNameById, searchQuery, sortAsc, specializations]);

  const currentRows = activeTab === 'departments' ? visibleDepartments : visibleSpecializations;
  const totalPages = Math.max(1, Math.ceil(currentRows.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedRows = currentRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const resetTab = (tab: 'departments' | 'specializations') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-card-foreground mb-2">Departments</h2>
        <p className="text-muted-foreground">View laboratory departments and their specializations</p>
      </div>

      <div className="flex items-center gap-4 mb-6 border-b border-border">
        <button
          onClick={() => resetTab('departments')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
            activeTab === 'departments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-card-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Departments
          </div>
        </button>
        <button
          onClick={() => resetTab('specializations')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
            activeTab === 'specializations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-card-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers3 className="w-4 h-4" />
            Department Specializations
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder={activeTab === 'departments' ? 'Search departments...' : 'Search specializations or departments...'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeTab === 'departments' &&
          (pagedRows as Department[]).map((department, index) => (
            <motion.div
              key={department.department_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                  #{department.department_id}
                </span>
              </div>
              <h4 className="text-card-foreground mb-2">{department.department_name}</h4>
              <p className="text-sm text-muted-foreground">
                {specializations.filter((specialization) => specialization.department_id === department.department_id).length}{' '}
                specializations
              </p>
            </motion.div>
          ))}

        {activeTab === 'specializations' &&
          (pagedRows as Specialization[]).map((specialization, index) => (
            <motion.div
              key={specialization.specialization_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                  <Layers3 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                  #{specialization.specialization_id}
                </span>
              </div>
              <h4 className="text-card-foreground mb-2">{specialization.specialization_name}</h4>
              <p className="text-sm text-muted-foreground">
                {departmentNameById.get(specialization.department_id) || 'Unknown Department'}
              </p>
            </motion.div>
          ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
