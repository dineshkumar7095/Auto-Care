import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { api } from "@automotive/api-client";
import { Badge, Body, Card, Field, Loading, Empty, colors, space } from "@automotive/mobile-kit";
import { formatINR } from "@automotive/utilities";
import { fitmentBadge } from "@/features/fitment";

export default function PartsScreen() {
  const [q, setQ] = useState("");
  const parts = useQuery({ queryKey: ["products", q], queryFn: () => api.catalogue.listProducts({ q: q || undefined }) });
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ padding: space(4), paddingBottom: 0 }}>
        <Field label="Search parts for Maruti Suzuki Swift VXi 2021" value={q} onChangeText={setQ} placeholder="Brake pads, oil filter, part number" returnKeyType="search" />
      </View>
      {parts.isPending ? <Loading /> : (
        <FlatList
          data={parts.data?.items ?? []}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: space(4), gap: space(3) }}
          ListEmptyComponent={<Empty title="No parts match that search." />}
          renderItem={({ item: p }) => {
            const fit = fitmentBadge(p.fitment);
            return (
              <Link href={{ pathname: "/part/[id]", params: { id: p.id } }} asChild>
                <Pressable accessibilityRole="link">
                  <Card>
                    <Badge label={fit.label} tone={fit.tone} />
                    <Body bold>{p.title}</Body>
                    <Body muted>{p.brand} · {p.partNumber} · {p.sellerName}</Body>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Body bold>{formatINR(p.pricePaise)}</Body>
                      <Body muted>{p.delivery}</Body>
                    </View>
                  </Card>
                </Pressable>
              </Link>
            );
          }}
        />
      )}
    </View>
  );
}
