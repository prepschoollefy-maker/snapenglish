import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ContactScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openGitHub = () => {
    Linking.openURL("https://github.com/prepschoollefy-maker/snapenglish/issues");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.backLink}>← トップに戻る</Text>
      </Pressable>

      <Text style={styles.title}>お問い合わせ</Text>

      <View style={styles.sections}>
        <View style={styles.section}>
          <Text style={styles.body}>
            SnapEnglish に関するお問い合わせ、著作権に関するご連絡は、以下の方法でお願いいたします。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>GitHub</Text>
          <Pressable onPress={openGitHub}>
            <Text style={styles.link}>
              https://github.com/prepschoollefy-maker/snapenglish/issues
            </Text>
          </Pressable>
          <Text style={styles.bodyMuted}>Issue を作成してご連絡ください。</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>著作権者の方へ</Text>
          <Text style={styles.body}>
            本サービスに関して著作権上の懸念がある場合は、上記の GitHub Issues よりご連絡ください。速やかに対応いたします。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>本サービスについて</Text>
          <Text style={styles.body}>・個人の英語学習を支援する非営利ツールです。</Text>
          <Text style={styles.body}>・入力データはサーバーに保存しません。</Text>
          <Text style={styles.body}>・1回の解析は数文に制限しています。</Text>
          <Text style={styles.body}>・教材や書籍の代替を意図するものではありません。</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    paddingHorizontal: 24,
  },
  backLink: {
    color: "#60a5fa",
    fontSize: 14,
    marginBottom: 32,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 32,
  },
  sections: {
    gap: 24,
  },
  section: {
    gap: 4,
  },
  heading: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  body: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 22,
  },
  bodyMuted: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  link: {
    color: "#60a5fa",
    fontSize: 14,
    lineHeight: 22,
  },
});
