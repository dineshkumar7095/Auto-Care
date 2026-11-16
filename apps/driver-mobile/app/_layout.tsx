import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Loading, LoginScreen, MobileAuthProvider, colors, useMobileAuth } from "@automotive/mobile-kit";
import { PORTAL, env } from "@/env";

function Gate() {
  const auth = useMobileAuth();
  if (!auth.ready) return <Loading />;
  if (!auth.session) return <LoginScreen appName="Dono Driver" demoPhone={env.useMocks ? "98000 00016" : undefined} />;
  return (
    <Stack screenOptions={{ headerTintColor: colors.navy, headerTitleStyle: { fontWeight: "700" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="trip/[id]" options={{ title: "Trip" }} />
    </Stack>
  );
}

export default function RootLayout() {
  // Jobs refresh every 15 s so new requests show up without pulling down.
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { refetchInterval: 15_000, retry: 1 } } }));
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <MobileAuthProvider portal={PORTAL} apiUrl={env.apiUrl} useMocks={env.useMocks}>
          <StatusBar style="dark" />
          <Gate />
        </MobileAuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
