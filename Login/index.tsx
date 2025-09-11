import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Warm up browser for smoother OAuth flow
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function LoginScreen() {
  useWarmUpBrowser();
  const navigation = useNavigation();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/screens/HomeScreen", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        // ✅ Clerk session is now active
        navigation.navigate("HomeScreen" as never); // <-- adjust to your navigator
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
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

    const pulseAnimation = Animated.loop(
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
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Background Image with Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/login.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        />
      </View>

      {/* Floating Elements */}
      <View style={styles.floatingElement1} />
      <View style={styles.floatingElement2} />
      <View style={styles.floatingElement3} />

      {/* Content Container */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Glass Card */}
        <View style={styles.glassCard}>
          <LinearGradient
            colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.15)"]}
            style={styles.glassGradient}
          >
            {/* Logo Section */}
            <Animated.View
              style={[styles.logoSection, { transform: [{ scale: pulseAnim }] }]}
            >
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.logoBackground}
                >
                  <Text style={styles.logoIcon}>🧠</Text>
                </LinearGradient>
              </View>

              <Text style={styles.brandName}>EchoMind</Text>
              <Text style={styles.tagline}>
                Turning conversations into clarity.
              </Text>
            </Animated.View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✨</Text>
                <Text style={styles.featureText}>AI-Powered Insights</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureText}>Smart Analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🚀</Text>
                <Text style={styles.featureText}>Instant Results</Text>
              </View>
            </View>

            {/* CTA Button */}
            <Pressable
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && styles.ctaButtonPressed,
              ]}
              onPress={onPress}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Text style={styles.buttonIcon}>→</Text>
              </LinearGradient>
            </Pressable>

            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
              <Text style={styles.bottomText}>Join thousands of users</Text>
              <View style={styles.trustIndicators}>
                <View style={styles.trustDot} />
                <View style={styles.trustDot} />
                <View style={styles.trustDot} />
                <Text style={styles.trustText}>Trusted by professionals</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
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
  gradientOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
  },
  floatingElement1: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(102, 126, 234, 0.2)",
    top: "15%",
    right: "10%",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingElement2: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(118, 75, 162, 0.3)",
    top: "25%",
    left: "5%",
    shadowColor: "#764ba2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingElement3: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    top: "35%",
    right: "25%",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
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
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  logoIcon: {
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
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
    paddingHorizontal: 10,
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
  ctaButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  ctaButtonPressed: {
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
  buttonIcon: {
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
  trustIndicators: {
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
  decorativeCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    top: -50,
    left: -50,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(118, 75, 162, 0.1)",
    bottom: -30,
    right: -30,
  },
});
