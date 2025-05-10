import { Stack } from "expo-router";

export default function ChallengeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // agar header tetap dikontrol dari TabsLayout
      }}
    />
  );
}
