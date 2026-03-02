import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

interface TextInputBoxProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

const MAX_LENGTH = 500;

export default function TextInputBox({ onSubmit, disabled }: TextInputBoxProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={text}
          onChangeText={(val) => setText(val.slice(0, MAX_LENGTH))}
          placeholder="英文を入力してください..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          editable={!disabled}
          multiline
          numberOfLines={3}
          style={styles.textInput}
          textAlignVertical="top"
        />
        <View style={styles.bottomRow}>
          <Text style={styles.charCount}>
            {text.length}/{MAX_LENGTH}
          </Text>
          <Pressable
            onPress={handleSubmit}
            disabled={disabled || text.trim().length === 0}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitPressed,
              (disabled || text.trim().length === 0) && styles.submitDisabled,
            ]}
          >
            <Text style={styles.submitText}>解析する</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 16,
  },
  textInput: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    minHeight: 72,
    padding: 0,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  charCount: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
  },
  submitPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
