import { motion } from 'motion/react';

interface Activity {
  id: string;
  name: string;
  assignedTo?: string;
  requestedBy?: string;
  status: 'pending' | 'approved' | 'completed' | 'in-progress';
  date: string;
  quantity?: number;
}

interface ActivityTableProps {
  title: string;
  activities: Activity[];
  type: 'equipment' | 'material';
  onStatusChange?: (id: string, status: Activity['status']) => void;
}

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-accent/20 text-accent border-accent/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export function ActivityTable({ title, activities, type, onStatusChange }: ActivityTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <h3 className="mb-4 text-card-foreground">{title}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm text-muted-foreground">
                {type === 'equipment' ? 'Equipment' : 'Material'}
              </th>
              <th className="text-left py-3 px-4 text-sm text-muted-foreground">
                {type === 'equipment' ? 'Assigned To' : 'Requested By'}
              </th>
              {type === 'material' && (
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Quantity</th>
              )}
              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <motion.tr
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-card-foreground">{activity.name}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {type === 'equipment' ? activity.assignedTo : activity.requestedBy}
                </td>
                {type === 'material' && (
                  <td className="py-3 px-4 text-sm text-muted-foreground">{activity.quantity}</td>
                )}
                <td className="py-3 px-4">
                  {onStatusChange && activity.status === 'pending' ? (
                    <select
                      value={activity.status}
                      onChange={(event) => onStatusChange(activity.id, event.target.value as Activity['status'])}
                      className={`text-xs px-2.5 py-1 rounded-full border bg-transparent
                                 focus:outline-none focus:ring-2 focus:ring-primary/40
                                 ${statusColors[activity.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[activity.status]}`}>
                      {activity.status}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{activity.date}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
