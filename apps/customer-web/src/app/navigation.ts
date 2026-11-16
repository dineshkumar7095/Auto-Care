/** Header navigation for the public customer site. */
export const SITE_NAV = [
  { to: "/parts", label: "Spare parts" },
  { to: "/services", label: "Services" },
  { to: "/towing", label: "Towing & roadside" },
  { to: "/business", label: "For business" },
] as const;

/** Business portals are separate apps on their own domains. */
export const PORTAL_LINKS = [
  { label: "Seller portal", href: import.meta.env.VITE_SELLER_PORTAL_URL ?? "http://localhost:5174" },
  { label: "Workshop portal", href: import.meta.env.VITE_WORKSHOP_PORTAL_URL ?? "http://localhost:5176" },
] as const;
