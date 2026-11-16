export type FleetVehicle = {
  id: string;
  fleetId: string;
  registration: string;
  model: string;
  category: "car" | "truck" | "bus" | "three-wheeler" | "ev";
  odometerKm: number;
  nextServiceKm: number;
  status: "active" | "in_service" | "breakdown" | "idle";
  driver: string | null;
};

export type ApprovalRequest = {
  id: string;
  fleetId: string;
  title: string;
  amountPaise: number;
  requestedBy: string;
  status: "pending" | "approved" | "rejected";
};

export type FleetSpendMonth = { month: string; partsPaise: number; servicePaise: number; towingPaise: number };
