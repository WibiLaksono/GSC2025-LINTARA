// (tabs)/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome5";
import { Tabs, useSegments } from "expo-router";

export default function TabsLayout() {
  const segments = useSegments();
  // segments = ["(tabs)", "challenge", "detail", "<id>"] saat di detail
  const isDetailScreen =
    segments[1] === "challenge" && segments[2] === "detail";

  return (
    <Tabs
      screenOptions={{
        headerShown: !isDetailScreen,
        headerStyle: {
          backgroundColor: "#bbf7d0",
        },
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: "#ffffff",
        },
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#000000",
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="action"
        options={{
          title: "Action",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="tasks" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          title: "Challenge",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="th-large" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
