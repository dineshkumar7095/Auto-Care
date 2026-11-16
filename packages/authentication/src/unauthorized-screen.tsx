import { ShieldX } from "lucide-react";
import { Button } from "@automotive/shared-ui/ui/button";
import { useAuth } from "./auth-context";

export function UnauthorizedScreen({ portalLabel }: { portalLabel: string }) {
  const auth = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <ShieldX className="mx-auto size-10 text-destructive" />
        <h1 className="mt-4 text-2xl font-semibold">No access to the {portalLabel} portal</h1>
        <p className="mt-2 text-sm text-muted-foreground">You're signed in as {auth.user?.name ?? "someone"}, but this account doesn't have a role here. Ask your business owner or Dono Auto Care support to add you.</p>
        <Button className="mt-6" variant="outline" onClick={auth.signOut}>
          Sign in with another account
        </Button>
      </div>
    </div>
  );
}
