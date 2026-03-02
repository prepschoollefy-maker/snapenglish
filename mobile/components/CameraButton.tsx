import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface CameraButtonProps {
  onImageSelected: (uri: string) => void;
  disabled?: boolean;
}

export default function CameraButton({
  onImageSelected,
  disabled,
}: CameraButtonProps) {
  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "カメラへのアクセス",
        "カメラを使用するには設定からカメラへのアクセスを許可してください。"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const launchGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "写真へのアクセス",
        "画像を選択するには設定から写真へのアクセスを許可してください。"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={launchCamera}
        disabled={disabled}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text style={styles.primaryIcon}>📷</Text>
        <Text style={styles.primaryText}>英語を撮影する</Text>
      </Pressable>

      <Pressable
        onPress={launchGallery}
        disabled={disabled}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text style={styles.secondaryIcon}>🖼️</Text>
        <Text style={styles.secondaryText}>画像を選択する</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#3b82f6",
    borderRadius: 16,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryIcon: {
    fontSize: 24,
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  secondaryIcon: {
    fontSize: 20,
  },
  secondaryText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
