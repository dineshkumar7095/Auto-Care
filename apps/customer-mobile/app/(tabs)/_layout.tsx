import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "@automotive/mobile-kit";

const icon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) => <Ionicons name={name} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.navy, headerTintColor: colors.navy, headerTitleStyle: { fontWeight: "700" } }}>
      <Tabs.Screen name="index" options={{ title: "Parts", tabBarIcon: icon("cube-outline") }} />
      <Tabs.Screen name="services" options={{ title: "Services", tabBarIcon: icon("construct-outline") }} />
      <Tabs.Screen name="towing" options={{ title: "Towing", tabBarIcon: icon("warning-outline"), tabBarActiveTintColor: colors.danger }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: icon("person-outline") }} />
    </Tabs>
  );
}
