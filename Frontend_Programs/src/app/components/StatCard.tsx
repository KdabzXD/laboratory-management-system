import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  valueFormatter?: (value: number) => string;
}

export function StatCard({ title, value, icon: Icon, trend, delay = 0, valueFormatter }: StatCardProps) {
  const displayValue = valueFormatter ? valueFormatter(value) : value.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            trend.isPositive ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {displayValue}
        </h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </motion.div>
  );
}
