import { AuthProvider, useAuth } from "@/lib/auth-context";
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({children} : {children : React.ReactNode}){
  const router = useRouter();
  const {user, isLoadingUser} = useAuth();
  const segments = useSegments()

  useEffect(()=>{
    const inAuthGroup = segments[0] === 'auth'
    if (!user && !inAuthGroup && !isLoadingUser){
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser){
      router.replace("/");
    }
  },[user,segments]);
  return <>{children}</>;
}


export default function RootLayout() {
    const [fontsLoaded] = useFonts({
    "sansation-reg": require("../assets/fonts/Sansation-Regular.ttf"),
    "sansation-bold": require("../assets/fonts/Sansation-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }
  return (
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <StatusBar backgroundColor={"black"}/>
            <RouteGuard>
              <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
              </Stack>
            </RouteGuard>
        </SafeAreaProvider>
        </PaperProvider>
    </AuthProvider>
  );
}


