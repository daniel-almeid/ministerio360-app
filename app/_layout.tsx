import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        style="light"
        backgroundColor="#0F0F0F"
        translucent={false}
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="tabs" />
      </Stack>

      <Toast
        position="bottom"
        bottomOffset={70}
      />
    </>
  );
}
