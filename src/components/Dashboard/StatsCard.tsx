import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?: 'primary' | 'success' | 'warning' | 'info';
}

export function StatsCard({ title, value, description, icon, trend, colorScheme = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: {
      icon: 'bg-primary/10 text-primary',
      value: 'text-primary',
      border: 'hover:border-primary/50',
    },
    success: {
      icon: 'bg-success/10 text-success',
      value: 'text-success',
      border: 'hover:border-success/50',
    },
    warning: {
      icon: 'bg-warning/10 text-warning',
      value: 'text-warning',
      border: 'hover:border-warning/50',
    },
    info: {
      icon: 'bg-info/10 text-info',
      value: 'text-info',
      border: 'hover:border-info/50',
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colors.border}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div className={`p-2 rounded-lg ${colors.icon}`}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colors.value}`}>{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}