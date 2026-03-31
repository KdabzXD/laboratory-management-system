import { useState, useMemo, useRef, useEffect } from 'react';
import { FileText, Download, BarChart3, Filter, Calendar, Users, Package, Building2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiGet } from '../api/client';

interface QueryResult {
  [key: string]: string | number;
}

interface Filter {
  dateFrom: string;
  dateTo: string;
  department: string;
  scientist: string;
  materialType: string;
  supplier: string;
  status: string;
  quantityMin: number;
  quantityMax: number;
}

const predefinedQueries = [
  { id: 1, name: 'All Scientists', category: 'Scientists' },
  { id: 2, name: 'Scientists by Department', category: 'Scientists' },
  { id: 3, name: 'Scientists Hired This Year', category: 'Scientists' },
  { id: 4, name: 'Senior Scientists (10+ years)', category: 'Scientists' },
  { id: 5, name: 'Scientists by Specialization', category: 'Scientists' },
  { id: 6, name: 'All Equipment', category: 'Equipment' },
  { id: 7, name: 'Equipment by Department', category: 'Equipment' },
  { id: 8, name: 'High-Value Equipment (>$50k)', category: 'Equipment' },
  { id: 9, name: 'Equipment by Supplier', category: 'Equipment' },
  { id: 10, name: 'Recently Purchased Equipment', category: 'Equipment' },
  { id: 11, name: 'Equipment Assignments', category: 'Assignments' },
  { id: 12, name: 'Current Equipment Assignments', category: 'Assignments' },
  { id: 13, name: 'Equipment Assignments by Scientist', category: 'Assignments' },
  { id: 14, name: 'Equipment Assignments This Month', category: 'Assignments' },
  { id: 15, name: 'Unassigned Equipment', category: 'Assignments' },
  { id: 16, name: 'All Materials', category: 'Materials' },
  { id: 17, name: 'Materials by Supplier', category: 'Materials' },
  { id: 18, name: 'Low-Cost Materials (<$100)', category: 'Materials' },
  { id: 19, name: 'High-Cost Materials (>$500)', category: 'Materials' },
  { id: 20, name: 'Materials by Category', category: 'Materials' },
  { id: 21, name: 'Material Requests', category: 'Requests' },
  { id: 22, name: 'Pending Material Requests', category: 'Requests' },
  { id: 23, name: 'Material Requests by Scientist', category: 'Requests' },
  { id: 24, name: 'Material Requests This Month', category: 'Requests' },
  { id: 25, name: 'High-Quantity Requests (>100 units)', category: 'Requests' },
  { id: 26, name: 'All Suppliers', category: 'Suppliers' },
  { id: 27, name: 'Suppliers by Location', category: 'Suppliers' },
  { id: 28, name: 'Top 10 Suppliers by Orders', category: 'Suppliers' },
  { id: 29, name: 'Suppliers with Multiple Contracts', category: 'Suppliers' },
  { id: 30, name: 'New Suppliers (This Year)', category: 'Suppliers' },
  { id: 31, name: 'All Purchases', category: 'Purchases' },
  { id: 32, name: 'Pending Purchases', category: 'Purchases' },
  { id: 33, name: 'Completed Purchases', category: 'Purchases' },
  { id: 34, name: 'Purchases by Supplier', category: 'Purchases' },
  { id: 35, name: 'Recent Purchases (Last 30 Days)', category: 'Purchases' },
  { id: 36, name: 'Department Budget Summary', category: 'Analytics' },
  { id: 37, name: 'Monthly Expenditure Report', category: 'Analytics' },
  { id: 38, name: 'Equipment Utilization Rate', category: 'Analytics' },
  { id: 39, name: 'Material Consumption Trends', category: 'Analytics' },
  { id: 40, name: 'Supplier Performance Metrics', category: 'Analytics' },
  { id: 41, name: 'Scientists Productivity Report', category: 'Analytics' },
  { id: 42, name: 'Equipment Maintenance Schedule', category: 'Maintenance' },
  { id: 43, name: 'Overdue Equipment Maintenance', category: 'Maintenance' },
  { id: 44, name: 'Equipment Downtime Report', category: 'Maintenance' },
  { id: 45, name: 'Material Inventory Levels', category: 'Inventory' },
  { id: 46, name: 'Low Stock Materials', category: 'Inventory' },
  { id: 47, name: 'Material Reorder List', category: 'Inventory' },
  { id: 48, name: 'Equipment Lifecycle Analysis', category: 'Lifecycle' },
  { id: 49, name: 'Asset Depreciation Report', category: 'Lifecycle' },
  { id: 50, name: 'Comprehensive Laboratory Report', category: 'Comprehensive' },
];

const departments = ['All', 'Molecular Biology', 'Biochemistry', 'Genetics', 'Immunology', 'Microbiology', 'Neuroscience'];
const scientists = ['All', 'Dr. Sarah Chen', 'Dr. Michael Ross', 'Dr. Emily Watson', 'Dr. James Park', 'Dr. Lisa Martinez', 'Dr. David Kim'];
const suppliers = ['All', 'BioTech Solutions', 'LabSupply Co.', 'Scientific Supplies Inc.', 'ChemLab Direct', 'MedTech Equipment'];
const statuses = ['All', 'Pending', 'Completed', 'In Progress', 'Cancelled'];

const COLORS = ['#06b6d4', '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899'];

export default function QueriesReports() {
  const [queryList, setQueryList] = useState(predefinedQueries);
  const [selectedQuery, setSelectedQuery] = useState(predefinedQueries[0]);
  const [queryData, setQueryData] = useState<QueryResult[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    dateFrom: '',
    dateTo: '',
    department: 'All',
    scientist: 'All',
    materialType: '',
    supplier: 'All',
    status: 'All',
    quantityMin: 0,
    quantityMax: 10000,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    apiGet<Array<{ id: number; name: string }>>('/queries')
      .then((rows) => {
        if (rows.length === 0) {
          return;
        }

        const merged = rows.map((row) => {
          const existing = predefinedQueries.find((q) => q.id === row.id);
          return {
            id: row.id,
            name: row.name,
            category: existing?.category || 'General',
          };
        });

        setQueryList(merged);
        setSelectedQuery(merged[0]);
      })
      .catch((error) => {
        console.error('Failed to load query catalog, using local definitions:', error);
      });
  }, []);

  useEffect(() => {
    apiGet<{ rows: QueryResult[] }>(`/queries/${selectedQuery.id}`)
      .then((result) => {
        setQueryData(result.rows || []);
      })
      .catch((error) => {
        console.error(`Failed to execute query ${selectedQuery.id}, using fallback data:`, error);
        setQueryData(generateQueryData(selectedQuery.id));
      });
  }, [selectedQuery.id]);

  // Generate mock data based on selected query
  const generateQueryData = (queryId: number): QueryResult[] => {
    const data: QueryResult[] = [];
    
    switch (queryId) {
      case 1: // All Scientists
      case 2: // Scientists by Department
        return [
          { ID: 'EMP001', Name: 'Dr. Sarah Chen', Department: 'Biochemistry', Specialization: 'Proteomics', 'Years of Experience': 12, Email: 'sarah.chen@lab.com' },
          { ID: 'EMP002', Name: 'Dr. Michael Ross', Department: 'Molecular Biology', Specialization: 'Genomics', 'Years of Experience': 8, Email: 'michael.ross@lab.com' },
          { ID: 'EMP003', Name: 'Dr. Emily Watson', Department: 'Genetics', Specialization: 'Gene Therapy', 'Years of Experience': 15, Email: 'emily.watson@lab.com' },
          { ID: 'EMP004', Name: 'Dr. James Park', Department: 'Immunology', Specialization: 'Antibodies', 'Years of Experience': 10, Email: 'james.park@lab.com' },
          { ID: 'EMP005', Name: 'Dr. Lisa Martinez', Department: 'Microbiology', Specialization: 'Bacteriology', 'Years of Experience': 7, Email: 'lisa.martinez@lab.com' },
          { ID: 'EMP006', Name: 'Dr. David Kim', Department: 'Neuroscience', Specialization: 'Neurochemistry', 'Years of Experience': 11, Email: 'david.kim@lab.com' },
        ];
      
      case 6: // All Equipment
      case 7: // Equipment by Department
        return [
          { 'Serial Number': 'EQ-001', Name: 'Advanced Spectrophotometer', Cost: 45000, Department: 'Biochemistry', Supplier: 'BioTech Solutions', Status: 'Operational' },
          { 'Serial Number': 'EQ-002', Name: 'PCR Thermal Cycler', Cost: 28500, Department: 'Molecular Biology', Supplier: 'LabSupply Co.', Status: 'Operational' },
          { 'Serial Number': 'EQ-003', Name: 'Centrifuge X-200', Cost: 15000, Department: 'Genetics', Supplier: 'Scientific Supplies Inc.', Status: 'Maintenance' },
          { 'Serial Number': 'EQ-004', Name: 'Microscope Elite Pro', Cost: 52000, Department: 'Microbiology', Supplier: 'MedTech Equipment', Status: 'Operational' },
          { 'Serial Number': 'EQ-005', Name: 'Flow Cytometer', Cost: 95000, Department: 'Immunology', Supplier: 'BioTech Solutions', Status: 'Operational' },
          { 'Serial Number': 'EQ-006', Name: 'Incubator CO2', Cost: 12000, Department: 'Genetics', Supplier: 'ChemLab Direct', Status: 'Operational' },
        ];
      
      case 11: // Equipment Assignments
      case 12: // Current Equipment Assignments
        return [
          { 'Assignment ID': 1, Equipment: 'Advanced Spectrophotometer', Scientist: 'Dr. Sarah Chen', Department: 'Biochemistry', 'Assignment Date': '2026-03-15', Status: 'Active' },
          { 'Assignment ID': 2, Equipment: 'PCR Thermal Cycler', Scientist: 'Dr. Michael Ross', Department: 'Molecular Biology', 'Assignment Date': '2026-03-18', Status: 'Active' },
          { 'Assignment ID': 3, Equipment: 'Microscope Elite Pro', Scientist: 'Dr. Emily Watson', Department: 'Genetics', 'Assignment Date': '2026-03-20', Status: 'Active' },
          { 'Assignment ID': 4, Equipment: 'Flow Cytometer', Scientist: 'Dr. James Park', Department: 'Immunology', 'Assignment Date': '2026-03-22', Status: 'Active' },
          { 'Assignment ID': 5, Equipment: 'Incubator CO2', Scientist: 'Dr. Lisa Martinez', Department: 'Microbiology', 'Assignment Date': '2026-03-25', Status: 'Active' },
        ];
      
      case 16: // All Materials
      case 17: // Materials by Supplier
        return [
          { 'Reference Number': 'MAT001', Material: 'DNA Extraction Kit', Description: 'High-purity DNA extraction', Cost: 245.00, Supplier: 'BioTech Solutions', Quantity: 50 },
          { 'Reference Number': 'MAT002', Material: 'Cell Culture Medium', Description: 'DMEM with 10% FBS', Cost: 89.50, Supplier: 'LabSupply Co.', Quantity: 120 },
          { 'Reference Number': 'MAT003', Material: 'Pipette Tips (1000μL)', Description: 'Sterile filtered tips', Cost: 65.00, Supplier: 'Scientific Supplies Inc.', Quantity: 500 },
          { 'Reference Number': 'MAT004', Material: 'Reagent Kit Alpha', Description: 'Comprehensive reagent kit', Cost: 389.99, Supplier: 'ChemLab Direct', Quantity: 25 },
          { 'Reference Number': 'MAT005', Material: 'Antibody Panel Set', Description: 'Complete antibody panel', Cost: 1250.00, Supplier: 'BioTech Solutions', Quantity: 10 },
          { 'Reference Number': 'MAT006', Material: 'PCR Master Mix', Description: '2X PCR master mix', Cost: 175.50, Supplier: 'ChemLab Direct', Quantity: 75 },
        ];
      
      case 21: // Material Requests
      case 22: // Pending Material Requests
        return [
          { 'Request ID': 1, Material: 'DNA Extraction Kit', Scientist: 'Dr. Sarah Chen', Department: 'Biochemistry', Quantity: 50, 'Request Date': '2026-03-15', Status: 'Pending' },
          { 'Request ID': 2, Material: 'PCR Master Mix', Scientist: 'Dr. Michael Ross', Department: 'Molecular Biology', Quantity: 100, 'Request Date': '2026-03-18', Status: 'Approved' },
          { 'Request ID': 3, Material: 'Cell Culture Medium', Scientist: 'Dr. Emily Watson', Department: 'Genetics', Quantity: 75, 'Request Date': '2026-03-20', Status: 'Pending' },
          { 'Request ID': 4, Material: 'Microcentrifuge Tubes', Scientist: 'Dr. James Park', Department: 'Immunology', Quantity: 200, 'Request Date': '2026-03-22', Status: 'Completed' },
          { 'Request ID': 5, Material: 'Antibody Panel Set', Scientist: 'Dr. Lisa Martinez', Department: 'Microbiology', Quantity: 25, 'Request Date': '2026-03-25', Status: 'Pending' },
        ];
      
      case 26: // All Suppliers
      case 27: // Suppliers by Location
        return [
          { 'Supplier ID': 1, Name: 'BioTech Solutions', Location: 'Boston, MA', Email: 'contact@biotech-solutions.com', Phone: '+1 (555) 111-2222', 'Total Orders': 45 },
          { 'Supplier ID': 2, Name: 'LabSupply Co.', Location: 'San Francisco, CA', Email: 'info@labsupply.com', Phone: '+1 (555) 222-3333', 'Total Orders': 38 },
          { 'Supplier ID': 3, Name: 'Scientific Supplies Inc.', Location: 'New York, NY', Email: 'sales@scisupply.com', Phone: '+1 (555) 333-4444', 'Total Orders': 52 },
          { 'Supplier ID': 4, Name: 'ChemLab Direct', Location: 'Chicago, IL', Email: 'orders@chemlab.com', Phone: '+1 (555) 444-5555', 'Total Orders': 29 },
          { 'Supplier ID': 5, Name: 'MedTech Equipment', Location: 'Seattle, WA', Email: 'support@medtech.com', Phone: '+1 (555) 555-6666', 'Total Orders': 41 },
        ];
      
      case 31: // All Purchases
      case 32: // Pending Purchases
        return [
          { 'Purchase ID': 'PO-2026-001', Material: 'DNA Extraction Kit', Quantity: 100, Supplier: 'BioTech Solutions', 'Purchase Date': '2026-03-15', Status: 'Pending', 'Total Cost': 24500 },
          { 'Purchase ID': 'PO-2026-002', Material: 'PCR Reagent Set', Quantity: 50, Supplier: 'LabSupply Co.', 'Purchase Date': '2026-03-18', Status: 'Completed', 'Total Cost': 8775 },
          { 'Purchase ID': 'PO-2026-003', Material: 'Microcentrifuge Tubes', Quantity: 200, Supplier: 'Scientific Supplies Inc.', 'Purchase Date': '2026-03-20', Status: 'Completed', 'Total Cost': 9000 },
          { 'Purchase ID': 'PO-2026-004', Material: 'Cell Culture Medium', Quantity: 75, Supplier: 'LabSupply Co.', 'Purchase Date': '2026-03-10', Status: 'Pending', 'Total Cost': 6712.5 },
          { 'Purchase ID': 'PO-2026-005', Material: 'Antibody Panel Set', Quantity: 25, Supplier: 'BioTech Solutions', 'Purchase Date': '2026-03-23', Status: 'Pending', 'Total Cost': 31250 },
        ];
      
      case 36: // Department Budget Summary
        return [
          { Department: 'Molecular Biology', Budget: 250000, Spent: 187500, Remaining: 62500, 'Utilization %': 75 },
          { Department: 'Biochemistry', Budget: 300000, Spent: 245000, Remaining: 55000, 'Utilization %': 82 },
          { Department: 'Genetics', Budget: 275000, Spent: 198000, Remaining: 77000, 'Utilization %': 72 },
          { Department: 'Immunology', Budget: 320000, Spent: 268000, Remaining: 52000, 'Utilization %': 84 },
          { Department: 'Microbiology', Budget: 280000, Spent: 215000, Remaining: 65000, 'Utilization %': 77 },
          { Department: 'Neuroscience', Budget: 350000, Spent: 298000, Remaining: 52100, 'Utilization %': 85 },
        ];
      
      case 37: // Monthly Expenditure Report
        return [
          { Month: 'January', Equipment: 45000, Materials: 28000, Supplies: 12000, Total: 85000 },
          { Month: 'February', Equipment: 52000, Materials: 31000, Supplies: 15000, Total: 98000 },
          { Month: 'March', Equipment: 38000, Materials: 35000, Supplies: 11000, Total: 84000 },
        ];
      
      default:
        return [
          { ID: 1, Name: 'Sample Data', Category: 'General', Value: 100, Status: 'Active', Date: '2026-03-28' },
          { ID: 2, Name: 'Sample Data', Category: 'General', Value: 200, Status: 'Pending', Date: '2026-03-27' },
          { ID: 3, Name: 'Sample Data', Category: 'General', Value: 150, Status: 'Completed', Date: '2026-03-26' },
        ];
    }
  };

  // Apply filters to data
  const filteredData = useMemo(() => {
    return queryData.filter((row) => {
      // Date filter
      if (filters.dateFrom && row.Date) {
        if (new Date(row.Date as string) < new Date(filters.dateFrom)) return false;
      }
      if (filters.dateTo && row.Date) {
        if (new Date(row.Date as string) > new Date(filters.dateTo)) return false;
      }
      
      // Department filter
      if (filters.department !== 'All' && row.Department) {
        if (row.Department !== filters.department) return false;
      }
      
      // Scientist filter
      if (filters.scientist !== 'All' && row.Scientist) {
        if (row.Scientist !== filters.scientist) return false;
      }
      
      // Supplier filter
      if (filters.supplier !== 'All' && row.Supplier) {
        if (row.Supplier !== filters.supplier) return false;
      }
      
      // Status filter
      if (filters.status !== 'All' && row.Status) {
        if (row.Status !== filters.status) return false;
      }
      
      // Quantity filter
      if (row.Quantity && typeof row.Quantity === 'number') {
        if (row.Quantity < filters.quantityMin || row.Quantity > filters.quantityMax) return false;
      }
      
      return true;
    });
  }, [queryData, filters]);

  // Generate PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(selectedQuery.name, 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Get table columns and data
    if (filteredData.length > 0) {
      const columns = Object.keys(filteredData[0]);
      const rows = filteredData.map(row => columns.map(col => String(row[col])));
      
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [6, 182, 212] },
        styles: { fontSize: 8 },
      });
    }
    
    doc.save(`${selectedQuery.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    
    const columns = Object.keys(filteredData[0]);
    const csvContent = [
      columns.join(','),
      ...filteredData.map(row => 
        columns.map(col => {
          const value = String(row[col]);
          return value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedQuery.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate chart data based on query
  const getChartData = () => {
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
    const row0 = filteredData[0] as QueryResult | undefined;
    if (!row0) return [];

    const keys = Object.keys(row0);
    const findKey = (candidates: string[]) => {
      return keys.find((key) => candidates.includes(normalize(key)));
    };

    const departmentKey = findKey(['department', 'departmentname']);
    const statusKey = findKey(['status', 'statusname']);
    const monthKey = findKey(['month']);

    if (selectedQuery.id === 36) {
      // Budget data
      return filteredData.map((row, index) => ({
        id: `budget-${index}`,
        name: row.Department,
        Budget: row.Budget,
        Spent: row.Spent,
        Remaining: row.Remaining,
      }));
    } else if (selectedQuery.id === 37) {
      // Monthly expenditure
      return filteredData.map((row, index) => ({
        id: `month-${index}`,
        Month: row.Month,
        Equipment: row.Equipment,
        Materials: row.Materials,
        Supplies: row.Supplies,
        Total: row.Total,
      }));
    } else if (departmentKey) {
      // Group by department
      const grouped: { [key: string]: number } = {};
      filteredData.forEach(row => {
        const dept = String((row as any)[departmentKey] || 'Unknown');
        grouped[dept] = (grouped[dept] || 0) + 1;
      });
      return Object.keys(grouped).map((dept, index) => ({ 
        id: `dept-${index}`,
        name: dept, 
        count: grouped[dept] 
      }));
    } else if (statusKey) {
      // Group by status
      const grouped: { [key: string]: number } = {};
      filteredData.forEach(row => {
        const status = String((row as any)[statusKey] || 'Unknown');
        grouped[status] = (grouped[status] || 0) + 1;
      });
      return Object.keys(grouped).map((status, index) => ({ 
        id: `status-${index}`,
        name: status, 
        value: grouped[status] 
      }));
    } else {
      // Generic fallback: chart the first numeric column by the first textual identifier.
      const numericKey = keys.find((key) => typeof (row0 as any)[key] === 'number');
      const labelKey = monthKey || keys.find((key) => typeof (row0 as any)[key] === 'string') || keys[0];

      if (!numericKey || !labelKey) return [];

      return filteredData.slice(0, 12).map((row, index) => ({
        id: `generic-${index}`,
        name: String((row as any)[labelKey] || `Item ${index + 1}`),
        value: Number((row as any)[numericKey] || 0),
      }));
    }
  };

  const chartData = getChartData();

  const renderChart = () => {
    if (selectedQuery.id === 36) {
      // Visual budget bars
      const maxBudget = Math.max(...filteredData.map(row => row.Budget as number));
      return (
        <div className="space-y-6">
          {filteredData.map((row, index) => (
            <div key={`budget-${index}`} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-card-foreground">{row.Department}</span>
                <span className="text-xs text-muted-foreground">
                  ${(row.Budget as number).toLocaleString()} budget
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <div className="h-8 rounded bg-primary/20 overflow-hidden">
                    <div 
                      className="h-full bg-primary flex items-center justify-center text-xs font-medium transition-all duration-500"
                      style={{ width: `${((row.Budget as number) / maxBudget) * 100}%` }}
                    >
                      {((row.Budget as number) / maxBudget) > 0.3 && 'Budget'}
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">${(row.Budget as number).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="h-8 rounded bg-accent/20 overflow-hidden">
                    <div 
                      className="h-full bg-accent flex items-center justify-center text-xs font-medium transition-all duration-500"
                      style={{ width: `${((row.Spent as number) / maxBudget) * 100}%` }}
                    >
                      {((row.Spent as number) / maxBudget) > 0.3 && 'Spent'}
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">${(row.Spent as number).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="h-8 rounded bg-purple-500/20 overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 flex items-center justify-center text-xs font-medium transition-all duration-500"
                      style={{ width: `${((row.Remaining as number) / maxBudget) * 100}%` }}
                    >
                      {((row.Remaining as number) / maxBudget) > 0.3 && 'Remaining'}
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">${(row.Remaining as number).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (selectedQuery.id === 37) {
      // Line-style visualization for monthly data
      const maxValue = Math.max(...filteredData.flatMap(row => [
        row.Equipment as number, 
        row.Materials as number, 
        row.Supplies as number
      ]));
      return (
        <div className="space-y-8">
          {filteredData.map((row, index) => (
            <div key={`month-${index}`} className="space-y-3">
              <h4 className="text-sm font-medium text-card-foreground">{row.Month}</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs w-24 text-muted-foreground">Equipment</span>
                  <div className="flex-1 h-6 rounded bg-primary/20 overflow-hidden">
                    <div 
                      className="h-full bg-primary flex items-center px-2 text-xs font-medium transition-all duration-500"
                      style={{ width: `${((row.Equipment as number) / maxValue) * 100}%` }}
                    >
                      ${(row.Equipment as number).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs w-24 text-muted-foreground">Materials</span>
                  <div className="flex-1 h-6 rounded bg-accent/20 overflow-hidden">
                    <div 
                      className="h-full bg-accent flex items-center px-2 text-xs font-medium transition-all duration-500"
                      style={{ width: `${((row.Materials as number) / maxValue) * 100}%` }}
                    >
                      ${(row.Materials as number).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs w-24 text-muted-foreground">Supplies</span>
                  <div className="flex-1 h-6 rounded bg-purple-500/20 overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 flex items-center px-2 text-xs font-medium transition-all duration-500"
                      style={{ width: `${((row.Supplies as number) / maxValue) * 100}%` }}
                    >
                      ${(row.Supplies as number).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                  <span className="text-xs w-24 text-primary font-medium">Total</span>
                  <div className="flex-1 h-8 rounded bg-orange-500/20 overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 flex items-center px-2 text-sm font-bold transition-all duration-500"
                      style={{ width: `${((row.Total as number) / (maxValue * 3)) * 100}%` }}
                    >
                      ${(row.Total as number).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Bar visualization for grouped data
      const dataKey = chartData[0]?.count !== undefined ? 'count' : 'value';
      const maxValue = Math.max(...chartData.map(item => item[dataKey] as number));
      return (
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={`bar-${index}`} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item[dataKey]} {dataKey === 'count' ? 'items' : 'total'}</span>
              </div>
              <div className="h-8 rounded bg-primary/20 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent flex items-center px-3 text-xs font-medium transition-all duration-500"
                  style={{ width: `${((item[dataKey] as number) / maxValue) * 100}%` }}
                >
                  {((item[dataKey] as number) / maxValue) > 0.2 && item[dataKey]}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-card-foreground mb-2">Queries & Reports</h2>
        <p className="text-muted-foreground">Generate comprehensive reports and analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Query Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-4">
            <h3 className="text-card-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Select Query
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {queryList.map((query) => (
                <button
                  key={query.id}
                  onClick={() => {
                    setSelectedQuery(query);
                    setShowChart(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300
                           ${selectedQuery.id === query.id
                             ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary'
                             : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-card-foreground'
                           }`}
                  title={query.name}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{query.name}</span>
                    <span className="text-xs opacity-60">{query.id}</span>
                  </div>
                  <div className="text-xs opacity-60 mt-1">{query.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Query Header and Actions */}
          <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-card-foreground mb-1">{selectedQuery.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedQuery.category} Report</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border
                         hover:bg-secondary/80 hover:border-primary/50 transition-all duration-300"
                title="Toggle Filters"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 pb-4 border-b border-border"
              >
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm
                             focus:outline-none focus:border-primary transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm
                             focus:outline-none focus:border-primary transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm
                             focus:outline-none focus:border-primary transition-all duration-300"
                  >
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Scientist</label>
                  <select
                    value={filters.scientist}
                    onChange={(e) => setFilters({ ...filters, scientist: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm
                             focus:outline-none focus:border-primary transition-all duration-300"
                  >
                    {scientists.map(sci => <option key={sci} value={sci}>{sci}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Supplier</label>
                  <select
                    value={filters.supplier}
                    onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm
                             focus:outline-none focus:border-primary transition-all duration-300"
                  >
                    {suppliers.map(sup => <option key={sup} value={sup}>{sup}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm
                             focus:outline-none focus:border-primary transition-all duration-300"
                  >
                    {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Min Quantity</label>
                  <input
                    type="number"
                    value={filters.quantityMin}
                    onChange={(e) => setFilters({ ...filters, quantityMin: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm
                             focus:outline-none focus:border-primary transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Max Quantity</label>
                  <input
                    type="number"
                    value={filters.quantityMax}
                    onChange={(e) => setFilters({ ...filters, quantityMax: parseInt(e.target.value) || 10000 })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm
                             focus:outline-none focus:border-primary transition-all duration-300"
                  />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGeneratePDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 
                         border border-primary/30 text-primary hover:from-primary/30 hover:to-accent/30 
                         transition-all duration-300 hover:scale-105"
                title="Download report as PDF"
              >
                <Download className="w-4 h-4" />
                Generate PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 
                         border border-accent/30 text-accent hover:from-accent/30 hover:to-primary/30 
                         transition-all duration-300 hover:scale-105"
                title="Export data as CSV file"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                         border border-purple-500/30 text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 
                         transition-all duration-300 hover:scale-105"
                title="Toggle chart visualization"
              >
                <BarChart3 className="w-4 h-4" />
                {showChart ? 'Hide Charts' : 'View Charts'}
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl overflow-hidden
                        shadow-xl shadow-primary/5">
            <div className="p-4 border-b border-border bg-secondary/30">
              <div className="flex items-center justify-between">
                <h4 className="text-card-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Query Results ({filteredData.length} records)
                </h4>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gradient-to-r from-secondary via-secondary to-secondary/80 
                                  backdrop-blur-sm border-b-2 border-primary/30 z-10">
                    <tr>
                      {filteredData.length > 0 && Object.keys(filteredData[0]).map((key) => (
                        <th key={key} className="text-left py-3 px-4 text-xs uppercase tracking-wider text-primary">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className="border-b border-border/50 hover:bg-gradient-to-r hover:from-primary/10 
                                 hover:via-primary/5 hover:to-transparent transition-all duration-300 
                                 group cursor-pointer"
                      >
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="py-3 px-4 text-sm text-card-foreground group-hover:text-primary
                                               transition-colors duration-300">
                            {typeof value === 'number' && value > 1000 
                              ? value.toLocaleString() 
                              : String(value)}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Chart Visualization */}
          {showChart && chartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6
                       shadow-xl shadow-primary/5"
            >
              <h4 className="text-card-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Data Visualization
              </h4>
              {renderChart()}
            </motion.div>
          )}

          {showChart && chartData.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 text-sm text-muted-foreground"
            >
              No chartable columns were detected for the current query and filter set.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}