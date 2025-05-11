// (tabs)/challenge/_layout.tsx
import { Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ChallengeLayout() {
  const router = useRouter();

  const routes = [
    { name: "Make", path: "/challenge/make" },
    { name: "Participating", path: "/challenge" },
    { name: "Join", path: "/challenge/join" },
  ];

  return (
    <Stack
      screenOptions={({ route }) => {
        // route.name akan "detail/[id]" saat menuju detail screen
        const isDetail = route.name === "detail/[id]";
        return {
          headerShown: !isDetail,
          header: isDetail
            ? undefined
            : () => (
                <View className="bg-green-200 flex-row justify-around items-center py-4">
                  {routes.map((rt) => (
                    <TouchableOpacity
                      key={rt.path}
                      onPress={() => router.push(rt.path)}
                      className="relative"
                    >
                      <Text className="text-green-900">{rt.name}</Text>
                      {router.pathname === rt.path && (
                        <View className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-900" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ),
        };
      }}
    />
  );
}
