import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoginScreen, MobileAuthProvider, colors, useMobileAuth, Loading } from "@automotive/mobile-kit";
import { PORTAL, env } from "@/env";

function Gate() {
  const auth = useMobileAuth();
  if (!auth.ready) return <Loading />;
  if (!auth.session) return <LoginScreen appName="Dono Auto Care" demoPhone={env.useMocks ? "98000 00001" : undefined} />;
  return (
    <Stack screenOptions={{ headerTintColor: colors.navy, headerTitleStyle: { fontWeight: "700" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="part/[id]" options={{ title: "Part details" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }));
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
