import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { api } from "@automotive/api-client";
import { Badge, Body, Button, Card, Field, H1, H2, Loading, colors, space } from "@automotive/mobile-kit";
import { formatINR } from "@automotive/utilities";
import { reviewSchema } from "@automotive/validation";
import { fitmentBadge } from "@/features/fitment";

export default function PartScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const part = useQuery({ queryKey: ["product", id], queryFn: () => api.catalogue.getProduct(id) });
  const reviews = useQuery({ queryKey: ["reviews", id], queryFn: () => api.reviews.listForProduct(id) });
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const post = useMutation({
    mutationFn: () => api.reviews.create({ productId: id, rating, text }),
    onSuccess: () => { setText(""); setRating(0); void qc.invalidateQueries({ queryKey: ["reviews", id] }); },
    onError: (e) => Alert.alert("Couldn't post review", e.message),
  });
  if (part.isPending) return <Loading />;
  if (!part.data) return <Body>Part not found.</Body>;
  const p = part.data.product;
  const fit = fitmentBadge(p.fitment);
  const valid = reviewSchema.safeParse({ productId: id, rating, text }).success;

  return (
    <ScrollView contentContainerStyle={{ padding: space(4), gap: space(4) }}>
      <Badge label={fit.label} tone={fit.tone} />
      <H1>{p.title}</H1>
      <Body muted>{p.brand} · Part no. {p.partNumber} · {p.partClass}</Body>
      <Card>
        <H2>{formatINR(p.pricePaise)}</H2>
        <Body muted>MRP {formatINR(p.mrpPaise)} · incl. {p.gstRatePct}% GST</Body>
        <Body>{p.delivery} · sold by {p.sellerName}</Body>
        <Body muted>{p.returnable ? "7-day return if unused" : "Not returnable once fitted"} · Warranty: {p.warranty}</Body>
        <Button title="Add to cart" onPress={() => Alert.alert("Added to cart", "Checkout connects once a payment provider is chosen.")} />
      </Card>
      <H2>Reviews</H2>
      {reviews.data?.map((r) => (
        <Card key={r.id}>
          <Body bold>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}  {r.authorName}</Body>
          {r.verifiedPurchase && <Badge label="Verified purchase" tone="success" />}
          <Body>{r.text}</Body>
        </Card>
      ))}
      <Card>
        <Body bold>Write a review</Body>
        <View style={{ flexDirection: "row", gap: space(2) }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Pressable key={i} accessibilityRole="button" accessibilityLabel={`${i} stars`} onPress={() => setRating(i)}>
              <Text style={{ fontSize: 28, color: i <= rating ? colors.warning : colors.border }}>★</Text>
            </Pressable>
          ))}
        </View>
        <Field label="Your review" value={text} onChangeText={setText} multiline placeholder="How was the fit and quality?" />
        <Button title="Post review" disabled={!valid} loading={post.isPending} onPress={() => post.mutate()} />
      </Card>
    </ScrollView>
  );
}
