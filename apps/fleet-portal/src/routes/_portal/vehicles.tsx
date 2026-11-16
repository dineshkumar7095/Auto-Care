import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { fleetVehiclesQuery } from "@/features/vehicles/api";
import { VehicleList } from "@/features/vehicles/components/vehicle-list";

export const Route = createFileRoute("/_portal/vehicles")({ component: VehiclesPage });

function VehiclesPage() {
  const vehicles = useQuery(fleetVehiclesQuery());
  return (
    <>
      <PageHeading title="Vehicles" subtitle="Every vehicle in your fleet." />
      {vehicles.isPending ? <ListSkeleton /> : <VehicleList vehicles={vehicles.data ?? []} />}
    </>
  );
}
