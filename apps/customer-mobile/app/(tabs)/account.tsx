import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, ScrollView, View } from "react-native";
import { api } from "@automotive/api-client";
import { ORDER_STATUS_LABEL, RETURN_REASON_LABEL } from "@automotive/shared-types";
import { Badge, Body, Button, Card, H1, H2, colors, space, useMobileAuth } from "@automotive/mobile-kit";
import { canRequestReturn, formatINR, maskPhone } from "@automotive/utilities";

export default function AccountScreen() {
  const auth = useMobileAuth();
  const qc = useQueryClient();
  const orders = useQuery({ queryKey: ["orders", "mine"], queryFn: () => api.orders.listMine() });
  const returns = useQuery({ queryKey: ["returns", "mine"], queryFn: () => api.returns.listMine() });
  const notes = useQuery({ queryKey: ["notifications"], queryFn: () => api.notifications.list() });
  const ret = useMutation({
    mutationFn: (orderId: string) => api.returns.request({ orderId, reason: "does_not_fit" }),
    onSuccess: (r) => { Alert.alert("Return requested", `${r.orderNumber}: the seller will reply within 48 hours.`); void qc.invalidateQueries(); },
    onError: (e) => Alert.alert("Couldn't request return", e.message),
  });
  const user = auth.session?.user;
  return (
    <ScrollView style={{ backgroundColor: colors.surface }} contentContainerStyle={{ padding: space(4), gap: space(3) }}>
      <H1>Hi, {user?.name.split(" ")[0]}</H1>
      <Body muted>{user ? maskPhone(user.phone) : ""}</Body>
      <H2>My orders</H2>
      {orders.data?.map((o) => (
        <Card key={o.id}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Body bold>{o.number}</Body>
            <Badge label={ORDER_STATUS_LABEL[o.status]} tone={o.status === "delivered" ? "success" : "info"} />
          </View>
          <Body muted>{o.lines.map((l) => l.title).join(", ")}</Body>
          <Body bold>{formatINR(o.totals.totalPaise)}</Body>
          {canRequestReturn(o) && <Button title="Return — doesn't fit" variant="outline" loading={ret.isPending} onPress={() => ret.mutate(o.id)} />}
        </Card>
      ))}
      {!!returns.data?.length && <H2>My returns</H2>}
      {returns.data?.map((r) => (
        <Card key={r.id}>
          <Body bold>{r.orderNumber} · {formatINR(r.amountPaise)}</Body>
          <Body muted>{RETURN_REASON_LABEL[r.reason]} · {r.status}</Body>
        </Card>
      ))}
      <H2>Notifications</H2>
      {notes.data?.map((n) => (
        <Card key={n.id}>
          <Body bold>{n.title}</Body>
          <Body muted>{n.body}</Body>
        </Card>
      ))}
      <Button title="Sign out" variant="outline" onPress={() => void auth.signOut()} />
    </ScrollView>
  );
}
