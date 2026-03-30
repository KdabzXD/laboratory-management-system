import { Users, Microscope, FlaskConical, Building2, ShoppingCart, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ActivityTable } from '../components/ActivityTable';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

const chartColors = ['#06b6d4', '#14b8a6', '#0891b2', '#0d9488', '#22d3ee', '#0ea5e9'];

type StatusType = 'pending' | 'approved' | 'completed' | 'in-progress';

function mapStatus(statusName: string | null | undefined): StatusType {
  const value = String(statusName || '').toLowerCase();
  if (value === 'completed') return 'completed';
  if (value === 'in progress') return 'in-progress';
  if (value === 'cancelled') return 'approved';
  return 'pending';
}

export default function Dashboard() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredPie, setHoveredPie] = useState<number | null>(null);
  const [stats, setStats] = useState([
    { title: 'Total Scientists', value: 0, icon: Users, trend: { value: 0, isPositive: true } },
    { title: 'Total Equipment', value: 0, icon: Microscope, trend: { value: 0, isPositive: true } },
    { title: 'Materials Cost', value: 0, icon: FlaskConical, trend: { value: 0, isPositive: true } },
    { title: 'Total Suppliers', value: 0, icon: Building2, trend: { value: 0, isPositive: true } },
    { title: 'Total Purchases', value: 0, icon: ShoppingCart, trend: { value: 0, isPositive: true } },
  ]);
  const [equipmentByDepartment, setEquipmentByDepartment] = useState<Array<{ department: string; count: number; color: string }>>([]);
  const [materialsCostBySupplier, setMaterialsCostBySupplier] = useState<Array<{ supplier: string; cost: number; percentage: number; color: string }>>([]);
  const [recentActivities, setRecentActivities] = useState<Array<{ type: string; action: string; item: string; user: string; time: string }>>([]);
  const [equipmentAssignments, setEquipmentAssignments] = useState<Array<{ id: string; name: string; assignedTo: string; status: StatusType; date: string }>>([]);
  const [materialRequests, setMaterialRequests] = useState<Array<{ id: string; name: string; requestedBy: string; quantity: number; status: StatusType; date: string }>>([]);

  useEffect(() => {
    async function loadDashboard() {
      const [statsResult, equipmentResult, supplierCostResult, activityResult, assignmentsResult, requestsResult] = await Promise.allSettled([
        apiGet<{ total_scientists: number; total_equipment: number; total_suppliers: number; total_purchases: number; total_material_cost: number }>('/dashboard/stats'),
        apiGet<Array<{ department_name: string; total: number }>>('/dashboard/equipment-by-department'),
        apiGet<Array<{ supplier_name: string; total_cost: number }>>('/dashboard/material-cost-by-supplier'),
        apiGet<Array<{ activity_type: string; description: string; performed_by: string; activity_time: string }>>('/activity?limit=8'),
        apiGet<Array<{ assignment_id: number; equipment_name: string; scientist_name: string; status_name: string | null; assignment_date: string }>>('/dashboard/latest-assignments?limit=6'),
        apiGet<Array<{ request_id: number; material_name: string; scientist_name: string; material_quantity: number; status_name: string | null; request_date: string }>>('/dashboard/latest-material-requests?limit=6'),
      ]);

      if (statsResult.status === 'fulfilled') {
        const statsData = statsResult.value;
        const totalCost = Number(statsData.total_material_cost || 0);
        setStats([
          { title: 'Total Scientists', value: Number(statsData.total_scientists || 0), icon: Users, trend: { value: 0, isPositive: true } },
          { title: 'Total Equipment', value: Number(statsData.total_equipment || 0), icon: Microscope, trend: { value: 0, isPositive: true } },
          { title: 'Materials Cost', value: totalCost, icon: FlaskConical, trend: { value: 0, isPositive: true } },
          { title: 'Total Suppliers', value: Number(statsData.total_suppliers || 0), icon: Building2, trend: { value: 0, isPositive: true } },
          { title: 'Total Purchases', value: Number(statsData.total_purchases || 0), icon: ShoppingCart, trend: { value: 0, isPositive: true } },
        ]);
      }

      if (equipmentResult.status === 'fulfilled') {
        const equipmentMapped = equipmentResult.value.map((row, index) => ({
          department: row.department_name,
          count: Number(row.total || 0),
          color: chartColors[index % chartColors.length],
        }));
        setEquipmentByDepartment(equipmentMapped);
      }

      if (supplierCostResult.status === 'fulfilled') {
        const supplierTotal = supplierCostResult.value.reduce((sum, row) => sum + Number(row.total_cost || 0), 0);
        setMaterialsCostBySupplier(
          supplierCostResult.value.map((row, index) => {
            const cost = Number(row.total_cost || 0);
            const percentage = supplierTotal > 0 ? Math.round((cost / supplierTotal) * 100) : 0;
            return {
              supplier: row.supplier_name,
              cost,
              percentage,
              color: chartColors[index % chartColors.length],
            };
          })
        );
      }

      if (activityResult.status === 'fulfilled') {
        setRecentActivities(
          activityResult.value.map((row) => ({
            type: row.activity_type || 'Activity',
            action: 'Updated',
            item: row.description,
            user: row.performed_by || 'System',
            time: new Date(row.activity_time).toLocaleString(),
          }))
        );
      }

      if (assignmentsResult.status === 'fulfilled') {
        setEquipmentAssignments(
          assignmentsResult.value.map((row) => ({
            id: String(row.assignment_id),
            name: row.equipment_name,
            assignedTo: row.scientist_name,
            status: mapStatus(row.status_name),
            date: new Date(row.assignment_date).toISOString().split('T')[0],
          }))
        );
      }

      if (requestsResult.status === 'fulfilled') {
        setMaterialRequests(
          requestsResult.value.map((row) => ({
            id: String(row.request_id),
            name: row.material_name,
            requestedBy: row.scientist_name,
            quantity: Number(row.material_quantity || 0),
            status: mapStatus(row.status_name),
            date: new Date(row.request_date).toISOString().split('T')[0],
          }))
        );
      }
    }

    loadDashboard().catch((error) => {
      console.error('Dashboard API load failed:', error);
    });
  }, []);

  const maxEquipmentCount = Math.max(1, ...equipmentByDepartment.map(d => d.count));
  const totalMaterialCost = stats.find((s) => s.title === 'Materials Cost')?.value || 0;

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
                  <div className="text-lg font-medium text-muted-foreground">{(totalMaterialCost / 1000000).toFixed(2)}M</div>
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
          type="equipment"
        />
        <ActivityTable
          title="Recent Material Requests"
          activities={materialRequests}
          type="material"
        />
      </div>
    </div>
  );
}
