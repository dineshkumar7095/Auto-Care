/** Every role in the platform. One user can hold several roles across businesses. */
export const ROLES = [
  "customer",
  "b2b_buyer",
  "seller_owner",
  "seller_staff",
  "distributor_admin",
  "distributor_sales",
  "workshop_owner",
  "workshop_manager",
  "technician",
  "towing_operator",
  "driver",
  "fleet_manager",
  "fleet_approver",
  "admin_super",
  "admin_ops",
  "admin_finance",
  "admin_support",
] as const;
export type Role = (typeof ROLES)[number];

export const PORTALS = [
  "customer-web",
  "seller-portal",
  "distributor-portal",
  "workshop-portal",
  "towing-portal",
  "fleet-portal",
  "admin-portal",
] as const;
export type PortalId = (typeof PORTALS)[number];

/** Which roles may sign in to which portal. Single source of truth for frontend guards and backend checks. */
export const PORTAL_ROLES: Record<PortalId, readonly Role[]> = {
  "customer-web": ["customer", "b2b_buyer"],
  "seller-portal": ["seller_owner", "seller_staff"],
  "distributor-portal": ["distributor_admin", "distributor_sales"],
  "workshop-portal": ["workshop_owner", "workshop_manager", "technician"],
  "towing-portal": ["towing_operator", "driver"],
  "fleet-portal": ["fleet_manager", "fleet_approver"],
  "admin-portal": ["admin_super", "admin_ops", "admin_finance", "admin_support"],
};

export const canAccessPortal = (roles: readonly Role[], portal: PortalId): boolean =>
  roles.some((r) => PORTAL_ROLES[portal].includes(r));

/** Fine-grained permissions checked inside a portal. */
export const PERMISSIONS = {
  "orders:fulfil": ["seller_owner", "seller_staff", "distributor_admin", "distributor_sales"],
  "catalogue:write": ["seller_owner", "distributor_admin"],
  "payouts:read": ["seller_owner", "distributor_admin", "workshop_owner", "towing_operator", "admin_finance", "admin_super"],
  "jobs:advance": ["workshop_owner", "workshop_manager", "technician"],
  "jobs:estimate": ["workshop_owner", "workshop_manager"],
  "partners:approve": ["admin_super", "admin_ops"],
  "refunds:approve": ["admin_super", "admin_finance"],
  "towing:dispatch": ["towing_operator", "admin_ops", "admin_super"],
  "trips:advance": ["towing_operator", "driver"],
  "fleet:approve": ["fleet_approver", "fleet_manager"],
} as const satisfies Record<string, readonly Role[]>;
export type Permission = keyof typeof PERMISSIONS;

export const hasPermission = (roles: readonly Role[], permission: Permission): boolean =>
  roles.some((r) => (PERMISSIONS[permission] as readonly Role[]).includes(r));

export const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  b2b_buyer: "Business buyer",
  seller_owner: "Owner",
  seller_staff: "Staff",
  distributor_admin: "Distributor admin",
  distributor_sales: "Sales",
  workshop_owner: "Owner",
  workshop_manager: "Service manager",
  technician: "Technician",
  towing_operator: "Operator",
  driver: "Driver",
  fleet_manager: "Fleet manager",
  fleet_approver: "Approver",
  admin_super: "Super admin",
  admin_ops: "Operations",
  admin_finance: "Finance",
  admin_support: "Support",
};
