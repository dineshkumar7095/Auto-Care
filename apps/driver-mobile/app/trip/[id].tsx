import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Alert, Linking, ScrollView } from "react-native";
import { api } from "@automotive/api-client";
import { TOWING_ISSUE_LABEL, TRIP_STATUS_LABEL } from "@automotive/shared-types";
import { Badge, Body, Button, Card, H1, Loading, colors, space } from "@automotive/mobile-kit";
import { formatINR, nextTripAction } from "@automotive/utilities";
import { TRIP_TONE, directionsUrl } from "@/features/trip-view";

export default function TripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const trips = useQuery({ queryKey: ["trips"], queryFn: () => api.towing.listTrips() });
  const advance = useMutation({
    mutationFn: (to: Parameters<typeof api.towing.updateTripStatus>[1]) => api.towing.updateTripStatus(id, to),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["trips"] }),
    onError: (e) => Alert.alert("Couldn't update", e.message),
  });
  const t = trips.data?.find((x) => x.id === id);
  if (trips.isPending) return <Loading />;
  if (!t) return <Body>This trip is no longer assigned to you.</Body>;
  const next = nextTripAction(t.status);
  const ev = t.issue === "ev_support";
  return (
    <ScrollView style={{ backgroundColor: colors.surface }} contentContainerStyle={{ padding: space(4), gap: space(3) }}>
      <Badge label={TRIP_STATUS_LABEL[t.status]} tone={TRIP_TONE[t.status]} />
      <H1>{t.number}</H1>
      <Body>{TOWING_ISSUE_LABEL[t.issue]} · {t.customerName} · {formatINR(t.quotedPaise)}</Body>
      {ev && (
        <Card style={{ backgroundColor: colors.warningSoft, borderColor: colors.warning }}>
          <Body bold>Electric vehicle</Body>
          <Body>Use the EV-safe flatbed only. Never tow on wheels. Don't touch orange high-voltage cables.</Body>
        </Card>
      )}
      <Card>
        <Body bold>Pick up</Body>
        <Body>{t.pickup}</Body>
        <Button title="Directions to pick-up" variant="outline" onPress={() => void Linking.openURL(directionsUrl(t.pickup))} />
      </Card>
      <Card>
        <Body bold>Drop</Body>
        <Body>{t.drop}</Body>
        <Button title="Directions to drop" variant="outline" onPress={() => void Linking.openURL(directionsUrl(t.drop))} />
      </Card>
      {next && <Button title={next.label} loading={advance.isPending} onPress={() => advance.mutate(next.to)} />}
      <Button title="Call 112 (emergency)" variant="danger" onPress={() => void Linking.openURL("tel:112")} />
    </ScrollView>
  );
}
