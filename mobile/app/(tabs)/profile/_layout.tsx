import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // agar header tetap dikontrol dari TabsLayout
      }}
    />
  );
}
