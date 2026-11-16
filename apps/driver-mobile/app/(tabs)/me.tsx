import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "react-native";
import { api } from "@automotive/api-client";
import { Body, Button, Card, H1, colors, space, useMobileAuth } from "@automotive/mobile-kit";
import { formatINR, maskPhone } from "@automotive/utilities";

export default function MeScreen() {
  const auth = useMobileAuth();
  const trips = useQuery({ queryKey: ["trips"], queryFn: () => api.towing.listTrips() });
  const user = auth.session?.user;
  const done = (trips.data ?? []).filter((t) => t.driverName === user?.name && t.status === "completed");
  return (
    <ScrollView style={{ backgroundColor: colors.surface }} contentContainerStyle={{ padding: space(4), gap: space(3) }}>
      <H1>{user?.name}</H1>
      <Body muted>{user ? maskPhone(user.phone) : ""} · Swift Recovery Services</Body>
      <Card>
        <Body bold>Completed trips</Body>
        <Body>{done.length} trips · {formatINR(done.reduce((s, t) => s + t.quotedPaise, 0))} billed</Body>
      </Card>
      <Button title="Sign out" variant="outline" onPress={() => void auth.signOut()} />
    </ScrollView>
  );
}
