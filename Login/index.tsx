import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

// Warm up browser for smoother OAuth flow
const useWarmUpBrowser = () => {
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, []);

  const onPress = useCallback(async () => {
    try {
      const redirectUrl = Linking.createURL("/screens/HomeScreen", {
        scheme: "myapp",
      });
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/screens/HomeScreen");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  }, [startOAuthFlow, router]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Background Image with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/login.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Animated Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.glassCard}>
          <LinearGradient
            colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
            style={styles.glassGradient}
          >
            {/* Logo and Brand */}
            <Animated.View
              style={{
                alignItems: "center",
                transform: [{ scale: pulseAnim }],
              }}
            >
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>🧠</Text>
              </View>
              <Text style={styles.brandName}>EchoMind</Text>
              <Text style={styles.tagline}>
                Turning conversations into clarity.
              </Text>
            </Animated.View>

            {/* Features */}
            <View style={styles.features}>
              {[
                { icon: "✨", text: "AI-Powered Insights" },
                { icon: "🎯", text: "Smart Analysis" },
                { icon: "🚀", text: "Instant Results" },
              ].map(({ icon, text }) => (
                <View key={text} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{icon}</Text>
                  <Text style={styles.featureText}>{text}</Text>
                </View>
              ))}
            </View>

            {/* CTA Button */}
            <Pressable
              onPress={onPress}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </LinearGradient>
            </Pressable>

            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
              <Text style={styles.bottomText}>Join thousands of users</Text>
              <View style={styles.trustRow}>
                <View style={styles.trustDot} />
                <View style={styles.trustDot} />
                <View style={styles.trustDot} />
                <Text style={styles.trustText}>Trusted by professionals</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: "65%",
    top: 0,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  glassCard: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  glassGradient: {
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  logoEmoji: {
    fontSize: 36,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
    marginBottom: 30,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
  button: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginRight: 8,
    letterSpacing: 0.5,
  },
  buttonArrow: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
  },
  bottomInfo: {
    alignItems: "center",
  },
  bottomText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 12,
    fontWeight: "500",
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  trustDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#667eea",
    marginRight: 6,
  },
  trustText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginLeft: 8,
  },
});
