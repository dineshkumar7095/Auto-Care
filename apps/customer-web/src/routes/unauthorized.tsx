import { createFileRoute } from "@tanstack/react-router";
import { UnauthorizedScreen } from "@automotive/authentication";
import { PORTAL_LABEL } from "@/app/config";

export const Route = createFileRoute("/unauthorized")({ component: () => <UnauthorizedScreen portalLabel={PORTAL_LABEL} /> });
