
export interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  description: string;
  icon: string;
  format: "number" | "currency" | "percentage";
}

export interface DashboardMetrics {
  totalClients: number;
  activeClients: number;

  totalVehicles: number;
  availableVehicles: number;
  rentedVehicles: number;
  fleetOccupancyRate: number;

  rentalsThisMonth: number;
  activeRentals: number;

  monthlyRevenue: number;
  averageTicket: number;
}

export interface DashboardState {
  metrics: DashboardMetrics;
  loading: boolean;
  error: string | null;
}
