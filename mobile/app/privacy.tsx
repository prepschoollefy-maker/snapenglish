import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

      <Text style={styles.title}>プライバシーポリシー</Text>

      <View style={styles.sections}>
        <View style={styles.section}>
          <Text style={styles.heading}>1. 収集する情報</Text>
          <Text style={styles.body}>
            本サービスは、ユーザーの個人情報を収集・保存しません。
          </Text>
          <Text style={styles.body}>・アカウント登録は不要です。</Text>
          <Text style={styles.body}>・入力された画像・テキストはサーバーに保存されません。</Text>
          <Text style={styles.body}>・解析結果はサーバーに保存されません。</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. データの処理フロー</Text>
          <Text style={styles.body}>1. ユーザーが画像またはテキストを送信します。</Text>
          <Text style={styles.body}>2. サーバーがAI（Google Gemini）に転送し、解析結果を取得します。</Text>
          <Text style={styles.body}>3. 結果をユーザーに返却後、サーバー上のデータは直ちに破棄されます。</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. ローカルストレージ</Text>
          <Text style={styles.body}>
            解析結果の履歴はアプリ内のローカルストレージに保存されます。これはユーザーの端末内にのみ存在し、サーバーには送信されません。アプリの設定からいつでも削除できます。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. 第三者サービス</Text>
          <Text style={styles.body}>
            本サービスは以下の第三者サービスを利用しています。
          </Text>
          <Text style={styles.body}>・Google Gemini API（テキスト解析処理）</Text>
          <Text style={styles.body}>・Vercel（ホスティング）</Text>
          <Text style={styles.body}>
            {"\n"}これらのサービスにおけるデータの取り扱いは、各サービスのプライバシーポリシーに準じます。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. 共有機能</Text>
          <Text style={styles.body}>
            本サービスに共有機能はありません。解析結果を他のユーザーと共有する手段は提供していません。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>6. お問い合わせ</Text>
          <Text style={styles.body}>
            本ポリシーに関するお問い合わせはお問い合わせページからご連絡ください。
          </Text>
        </View>

        <Text style={styles.lastUpdated}>最終更新日: 2026年2月21日</Text>
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
  lastUpdated: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 16,
  },
});
