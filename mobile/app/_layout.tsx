import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      {/* Default screens */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal Screens */}
      <Stack.Screen
        name="auth/registerPage"
        options={{ presentation: "modal", animation: "slide_from_bottom", headerShown: false }}
      />
      <Stack.Screen
        name="auth/loginPage"
        options={{ presentation: "transparentModal", animation: "slide_from_bottom", headerShown: false, contentStyle: { backgroundColor: "transparent" }, }}
      />
    </Stack>
  );
}
