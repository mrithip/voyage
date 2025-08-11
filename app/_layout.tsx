import { AuthProvider, useAuth } from "@/lib/auth-context";
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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

  if (isLoadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#f8fafc', '#e2e8f0']}
          style={styles.gradientBackground}
        >
          <ActivityIndicator size="large" color="#3b82f6" />
        </LinearGradient>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "sansation-reg": require("../assets/fonts/Sansation-Regular.ttf"),
    "sansation-bold": require("../assets/fonts/Sansation-Bold.ttf"),
  });

  // const fontConfig = {
  //   default: {
  //     regular: {
  //       fontFamily: 'sansation-reg',
  //       fontWeight: 'normal',
  //     },
  //     medium: {
  //       fontFamily: 'sansation-reg',
  //       fontWeight: 'normal',
  //     },
  //     light: {
  //       fontFamily: 'sansation-reg',
  //       fontWeight: 'normal',
  //     },
  //     thin: {
  //       fontFamily: 'sansation-reg',
  //       fontWeight: 'normal',
  //     },
  //   },
  // };

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.splashContainer}>
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={styles.splashGradient}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </LinearGradient>
      </View>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider >
        <SafeAreaProvider>
          {/* <StatusBar style="dark" /> */}
          <RouteGuard>
            <Stack 
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: '#f8fafc',
                }
              }}
            >
              <Stack.Screen 
                name="(tabs)" 
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="auth" 
                options={{
                  animation: 'fade',
                }}
              />
            </Stack>
          </RouteGuard>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
  splashGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});