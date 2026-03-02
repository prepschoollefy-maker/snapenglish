import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

interface LoadingScreenProps {
  thumbnail?: string;
  mode?: "image" | "text";
}

const IMAGE_MESSAGES = [
  "画像をアップロード中...",
  "英文を読み取っています...",
  "文構造を解析しています...",
];

const TEXT_MESSAGES = [
  "英文を解析しています...",
  "文構造を解析しています...",
];

export default function LoadingScreen({
  thumbnail,
  mode = "image",
}: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = mode === "text" ? TEXT_MESSAGES : IMAGE_MESSAGES;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setMessageIndex(0);
  }, [mode]);

  // Spinner rotation
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [spinAnim]);

  // Pulse animation for text
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Rotate through messages
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [messages.length]);

  const spinInterpolation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* サムネイル */}
      {thumbnail ? (
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        </View>
      ) : null}

      {/* スピナー */}
      <View style={styles.spinnerContainer}>
        <View style={styles.spinnerTrack} />
        <Animated.View
          style={[
            styles.spinnerActive,
            { transform: [{ rotate: spinInterpolation }] },
          ]}
        />
      </View>

      {/* ステータスメッセージ */}
      <Animated.Text style={[styles.message, { opacity: pulseAnim }]}>
        {messages[messageIndex]}
      </Animated.Text>

      {/* プログレスドット */}
      <View style={styles.dotsContainer}>
        {messages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i <= messageIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  thumbnailContainer: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  thumbnail: {
    width: 192,
    height: 192,
  },
  spinnerContainer: {
    marginBottom: 24,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerTrack: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "rgba(59,130,246,0.3)",
  },
  spinnerActive: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "transparent",
    borderTopColor: "#3b82f6",
  },
  message: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 18,
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#3b82f6",
  },
  dotInactive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: [{ scale: 0.75 }],
  },
});
