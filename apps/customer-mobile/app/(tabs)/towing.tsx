import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, View } from "react-native";
import { api } from "@automotive/api-client";
import { TOWING_ISSUES, TOWING_ISSUE_LABEL, type TowingIssue } from "@automotive/shared-types";
import { Badge, Body, Button, Card, Field, H2, colors, radius, space } from "@automotive/mobile-kit";
import { formatINR } from "@automotive/utilities";
import { EMERGENCY_NUMBER } from "@/env";

export default function TowingScreen() {
  const [issue, setIssue] = useState<TowingIssue>("breakdown");
  const [pickup, setPickup] = useState("");
  const providers = useQuery({ queryKey: ["towing", issue], queryFn: () => api.towing.listProviders({ issue }) });
  const request = useMutation({
    mutationFn: (providerId: string) => api.towing.requestTrip({ issue, pickup, drop: "Nearest verified workshop", vehicleLabel: "Maruti Suzuki Swift · TS 09 MX 4412", providerId }),
    onSuccess: (t) => Alert.alert("Help is on the way", `${t.number} sent. The driver will call you.`),
    onError: (e) => Alert.alert("Couldn't request", e.message),
  });
  return (
    <ScrollView style={{ backgroundColor: colors.surface }} contentContainerStyle={{ padding: space(4), gap: space(4) }}>
      <Card style={{ backgroundColor: colors.dangerSoft, borderColor: colors.danger }}>
        <Body bold>Accident, injury, fire or unsafe spot?</Body>
        <Body>Call emergency services first. Towing is not an emergency service.</Body>
        <Button title={`Call ${EMERGENCY_NUMBER} now`} variant="danger" onPress={() => void Linking.openURL(`tel:${EMERGENCY_NUMBER}`)} />
      </Card>
      <H2>What happened?</H2>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space(2) }}>
        {TOWING_ISSUES.map((i) => (
          <Pressable key={i} accessibilityRole="button" accessibilityState={{ selected: issue === i }} onPress={() => setIssue(i)}
            style={{ paddingHorizontal: space(3), paddingVertical: space(2), borderRadius: radius.pill, borderWidth: 1, borderColor: issue === i ? colors.navy : colors.border, backgroundColor: issue === i ? colors.navy : colors.background }}>
            <Body>{issue === i ? "✓ " : ""}{TOWING_ISSUE_LABEL[i]}</Body>
          </Pressable>
        ))}
      </View>
      <Field label="Where are you?" value={pickup} onChangeText={setPickup} placeholder="e.g. ORR, Gachibowli exit" />
      {issue === "ev_support" && <Badge label="Only EV-safe flatbeds are shown" tone="info" />}
      {providers.data?.map((p) => (
        <Card key={p.id}>
          <Body bold>{p.name}</Body>
          <Body muted>{p.truck} · {p.distanceKm} km away · ETA {p.etaMin} min · ★ {p.rating}</Body>
          <Body>Quote {formatINR(p.pricePaise)}</Body>
          <Button title="Request this truck" disabled={pickup.trim().length < 3} loading={request.isPending} onPress={() => request.mutate(p.id)} />
        </Card>
      ))}
    </ScrollView>
  );
}
