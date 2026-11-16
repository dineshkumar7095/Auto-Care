/** Customer's garage. Comes from GET /vehicles once the account flow is wired to the backend. */
export const savedVehicles = [
  { id: "v1", label: "Maruti Suzuki Swift VXi 2021", reg: "TS 09 MX 4412" },
  { id: "v2", label: "Honda Activa 6G 2022", reg: "TS 08 HJ 9081" },
  { id: "v3", label: "Tata Nexon EV Max 2023", reg: "TS 07 EV 2210" },
] as const;
export const defaultVehicle = savedVehicles[0];
