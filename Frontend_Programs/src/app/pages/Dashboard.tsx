import { Users, Microscope, FlaskConical, Building2, ShoppingCart, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ActivityTable } from '../components/ActivityTable';
import { motion } from 'motion/react';
import { useState } from 'react';

const stats = [
  { title: 'Total Scientists', value: 127, icon: Users, trend: { value: 12, isPositive: true } },
  { title: 'Total Equipment', value: 342, icon: Microscope, trend: { value: 8, isPositive: true } },
  { title: 'Materials Cost', value: 'KSh 2.45M', icon: FlaskConical, trend: { value: -3, isPositive: false }, isMonetary: true },
  { title: 'Total Suppliers', value: 56, icon: Building2, trend: { value: 5, isPositive: true } },
  { title: 'Total Purchases', value: 892, icon: ShoppingCart, trend: { value: 15, isPositive: true } },
];

const equipmentAssignments = [
  {
    id: '1',
    name: 'Advanced Spectrophotometer',
    assignedTo: 'Dr. Sarah Chen',
    status: 'in-progress' as const,
    date: '2026-03-24',
  },
  {
    id: '2',
    name: 'PCR Thermal Cycler',
    assignedTo: 'Dr. Michael Ross',
    status: 'completed' as const,
    date: '2026-03-23',
  },
  {
    id: '3',
    name: 'Centrifuge X-200',
    assignedTo: 'Dr. Emily Watson',
    status: 'approved' as const,
    date: '2026-03-22',
  },
  {
    id: '4',
    name: 'Microscope Elite Pro',
    assignedTo: 'Dr. James Park',
    status: 'pending' as const,
    date: '2026-03-21',
  },
];

const materialRequests = [
  {
    id: '1',
    name: 'DNA Extraction Kit',
    requestedBy: 'Dr. Sarah Chen',
    quantity: 50,
    status: 'approved' as const,
    date: '2026-03-24',
  },
  {
    id: '2',
    name: 'Cell Culture Medium',
    requestedBy: 'Dr. Michael Ross',
    quantity: 100,
    status: 'in-progress' as const,
    date: '2026-03-23',
  },
  {
    id: '3',
    name: 'Pipette Tips (1000μL)',
    requestedBy: 'Dr. Emily Watson',
    quantity: 500,
    status: 'completed' as const,
    date: '2026-03-22',
  },
  {
    id: '4',
    name: 'Reagent Kit Alpha',
    requestedBy: 'Dr. James Park',
    quantity: 25,
    status: 'pending' as const,
    date: '2026-03-21',
  },
];

// Equipment per Department data
const equipmentByDepartment = [
  { department: 'Molecular Biology', count: 85, color: '#06b6d4' },
  { department: 'Biochemistry', count: 72, color: '#14b8a6' },
  { department: 'Genetics', count: 58, color: '#0891b2' },
  { department: 'Immunology', count: 65, color: '#0d9488' },
  { department: 'Microbiology', count: 62, color: '#06b6d4' },
];

// Materials cost per Supplier data
const materialsCostBySupplier = [
  { supplier: 'BioTech Solutions', cost: 825000, percentage: 34, color: '#06b6d4' },
  { supplier: 'LabSupply Co.', cost: 587500, percentage: 24, color: '#14b8a6' },
  { supplier: 'ChemLab Direct', cost: 490000, percentage: 20, color: '#0891b2' },
  { supplier: 'Scientific Supplies', cost: 367500, percentage: 15, color: '#0d9488' },
  { supplier: 'Others', cost: 180000, percentage: 7, color: '#22d3ee' },
];

const recentActivities = [
  { type: 'Equipment', action: 'Added', item: 'Flow Cytometer', user: 'Dr. Sarah Chen', time: '2 hours ago' },
  { type: 'Material', action: 'Requested', item: 'PCR Master Mix', user: 'Dr. Michael Ross', time: '4 hours ago' },
  { type: 'Scientist', action: 'Registered', item: 'Dr. Lisa Martinez', user: 'Admin', time: '6 hours ago' },
  { type: 'Purchase', action: 'Completed', item: 'Antibody Panel Set', user: 'Dr. James Park', time: '1 day ago' },
];

export default function Dashboard() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredPie, setHoveredPie] = useState<number | null>(null);

  const maxEquipmentCount = Math.max(...equipmentByDepartment.map(d => d.count));

  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bar Chart - Equipment per Department */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 
                   hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        >
          <h3 className="text-lg font-medium text-card-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Equipment per Department
          </h3>
          <div className="space-y-4">
            {equipmentByDepartment.map((item, index) => (
              <div 
                key={item.department}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.department}</span>
                  <span className={`font-medium transition-all duration-300 ${
                    hoveredBar === index ? 'text-primary scale-110' : 'text-card-foreground'
                  }`}>
                    {item.count}
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxEquipmentCount) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      hoveredBar === index ? 'opacity-100' : 'opacity-80'
                    }`}
                    style={{ 
                      background: `linear-gradient(to right, ${item.color}, ${item.color}dd)`,
                      boxShadow: hoveredBar === index ? `0 0 20px ${item.color}40` : 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pie Chart - Materials Cost per Supplier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 
                   hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        >
          <h3 className="text-lg font-medium text-card-foreground mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-accent" />
            Materials Cost by Supplier
          </h3>
          
          {/* CSS-based Pie Chart */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {materialsCostBySupplier.map((item, index) => {
                  const previousPercentage = materialsCostBySupplier
                    .slice(0, index)
                    .reduce((sum, s) => sum + s.percentage, 0);
                  const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                  const strokeDashoffset = -previousPercentage;

                  return (
                    <circle
                      key={item.supplier}
                      cx="50"
                      cy="50"
                      r="15.915"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="31.83"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className={`transition-all duration-300 cursor-pointer ${
                        hoveredPie === index ? 'opacity-100' : 'opacity-80'
                      }`}
                      style={{
                        filter: hoveredPie === index ? `drop-shadow(0 0 10px ${item.color})` : 'none',
                      }}
                      onMouseEnter={() => setHoveredPie(index)}
                      onMouseLeave={() => setHoveredPie(null)}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">KSh</div>
                  <div className="text-lg font-medium text-muted-foreground">2.45M</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {materialsCostBySupplier.map((item, index) => (
              <div
                key={item.supplier}
                onMouseEnter={() => setHoveredPie(index)}
                onMouseLeave={() => setHoveredPie(null)}
                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  hoveredPie === index ? 'bg-secondary/50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.supplier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-card-foreground">
                    KSh {(item.cost / 1000).toFixed(0)}K
                  </span>
                  <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 
                 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
      >
        <h3 className="text-lg font-medium text-card-foreground mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 
                       transition-all duration-300 border border-border/50 hover:border-primary/30 
                       group cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform duration-300" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    {activity.type}
                  </span>
                  <span className="text-sm font-medium text-card-foreground">
                    {activity.action}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {activity.item}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>by {activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ActivityTable
          title="Latest Equipment Assignments"
          activities={equipmentAssignments}
        />
        <ActivityTable
          title="Recent Material Requests"
          activities={materialRequests}
        />
      </div>
    </div>
  );
}
