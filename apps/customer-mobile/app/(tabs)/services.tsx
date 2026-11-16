import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, FlatList, View } from "react-native";
import { api } from "@automotive/api-client";
import { Badge, Body, Button, Card, Loading, colors, space } from "@automotive/mobile-kit";
import { formatINR } from "@automotive/utilities";

export default function ServicesScreen() {
  const workshops = useQuery({ queryKey: ["workshops"], queryFn: () => api.bookings.listWorkshops({}) });
  const book = useMutation({
    mutationFn: (w: { id: string; name: string; nextSlot: string; specialties: string[] }) =>
      api.bookings.create({ workshopId: w.id, service: w.specialties[0] ?? "General service", slot: w.nextSlot, vehicleLabel: "Maruti Suzuki Swift VXi 2021 · TS 09 MX 4412" }),
    onSuccess: (_b, w) => Alert.alert("Booked", `${w.name}, ${w.nextSlot}. You'll approve the estimate before any work starts.`),
    onError: (e) => Alert.alert("Couldn't book", e.message),
  });
  if (workshops.isPending) return <Loading />;
  return (
    <FlatList
      style={{ backgroundColor: colors.surface }}
      data={workshops.data ?? []}
      keyExtractor={(w) => w.id}
      contentContainerStyle={{ padding: space(4), gap: space(3) }}
      renderItem={({ item: w }) => (
        <Card>
          <View style={{ flexDirection: "row", gap: space(2), flexWrap: "wrap" }}>
            {w.verified ? <Badge label="Verified workshop" tone="success" /> : <Badge label="Not verified yet" tone="neutral" />}
            {w.evQualified && <Badge label="EV high-voltage qualified" tone="info" />}
          </View>
          <Body bold>{w.name}</Body>
          <Body muted>{w.area}, {w.city} · {w.distanceKm} km · ★ {w.rating}</Body>
          <Body>{w.specialties.join(" · ")}</Body>
          <Body muted>From {formatINR(w.fromPricePaise)} · Next slot {w.nextSlot}</Body>
          <Button title="Book next slot" loading={book.isPending && book.variables?.id === w.id} onPress={() => book.mutate(w)} />
        </Card>
      )}
    />
  );
}
