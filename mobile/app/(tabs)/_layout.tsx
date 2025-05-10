import { Tabs, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome5";
import { View, Pressable } from "react-native";

export default function TabsLayout() {
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#bbf7d0", // bg-green-200
                },
                headerTitleAlign: "center",
                tabBarStyle: {
                    backgroundColor: "#ffffff", // bg-white
                },
                tabBarActiveTintColor: "#16a34a", // text-green-600
                tabBarInactiveTintColor: "#000000", // text-black
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
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: "Community",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="users" size={size} color={color} />
                    ),
                    headerShown: false
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
                    headerShown: false
                }}
            />
        </Tabs>
    );
}
