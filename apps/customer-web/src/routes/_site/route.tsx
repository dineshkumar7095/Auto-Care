import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/layouts/customer-layout";

/** Public site chrome (header + footer). Browsing needs no sign-in. */
export const Route = createFileRoute("/_site")({ component: CustomerLayout });
