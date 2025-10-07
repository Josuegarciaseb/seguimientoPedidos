// frontend/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarStyle: { backgroundColor: "#f8f9fa", borderTopWidth: 0.5 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
