import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Ẩn tab bar mặc định vì app dùng custom TabsBar
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="discovery" />
      <Tabs.Screen name="library" />
      <Tabs.Screen name="player" />
      <Tabs.Screen name="upload" />
      <Tabs.Screen name="user" />
    </Tabs>
  );
}
