// Note: The file name seems to have a typo. It should probably be "dashboard.service.ts" instead of "dadhboard.service.ts".
import api from "./api.service";
import type { DashboardOverview } from "../types/dashboard";

const dashboardService = {
   async getOverview(): Promise<DashboardOverview> {
    const response = await api.get("/dashboard/overview");
    return response.data.data;
  }
};

export default dashboardService;
