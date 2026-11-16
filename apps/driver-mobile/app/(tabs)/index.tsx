import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { FlatList, Pressable, RefreshControl } from "react-native";
import { api } from "@automotive/api-client";
import { TOWING_ISSUE_LABEL, TRIP_STATUS_LABEL } from "@automotive/shared-types";
import { Badge, Body, Card, Empty, Loading, colors, space, useMobileAuth } from "@automotive/mobile-kit";
import { formatINR } from "@automotive/utilities";
import { TRIP_TONE, sortForDriver } from "@/features/trip-view";

export default function JobsScreen() {
  const auth = useMobileAuth();
  const trips = useQuery({ queryKey: ["trips"], queryFn: () => api.towing.listTrips() });
  if (trips.isPending) return <Loading />;
  const items = sortForDriver(trips.data ?? [], auth.session?.user.name ?? "");
  return (
    <FlatList
      style={{ backgroundColor: colors.surface }}
      data={items}
      keyExtractor={(t) => t.id}
      refreshControl={<RefreshControl refreshing={trips.isFetching} onRefresh={() => void trips.refetch()} />}
      contentContainerStyle={{ padding: space(4), gap: space(3) }}
      ListEmptyComponent={<Empty title="No jobs right now." />}
      renderItem={({ item: t }) => (
        <Link href={{ pathname: "/trip/[id]", params: { id: t.id } }} asChild>
          <Pressable accessibilityRole="link">
            <Card>
              <Badge label={TRIP_STATUS_LABEL[t.status]} tone={TRIP_TONE[t.status]} />
              <Body bold>{t.number} · {TOWING_ISSUE_LABEL[t.issue]}</Body>
              <Body>From {t.pickup}</Body>
              <Body muted>To {t.drop} · {formatINR(t.quotedPaise)}</Body>
            </Card>
          </Pressable>
        </Link>
      )}
    />
  );
}
