import { Stack } from "expo-router";

export default function CommunityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // agar header tetap dikontrol dari TabsLayout
      }}
    />
  );
}
