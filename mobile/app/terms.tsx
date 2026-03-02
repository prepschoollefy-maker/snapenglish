import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsScreen() {
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

      <Text style={styles.title}>利用規約</Text>

      <View style={styles.sections}>
        <View style={styles.section}>
          <Text style={styles.heading}>1. サービスの目的</Text>
          <Text style={styles.body}>
            SnapEnglish（以下「本サービス」）は、英語学習を支援する個人向けツールです。入力された英文に対し、AIによる和訳と文構造解析を提供します。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. 利用条件</Text>
          <Text style={styles.body}>・本サービスは個人の学習目的でのみ利用してください。</Text>
          <Text style={styles.body}>・解析結果を転載・配布・商用利用しないでください。</Text>
          <Text style={styles.body}>・利用権限のある文章のみを入力してください。</Text>
          <Text style={styles.body}>・1回の入力は1〜3文程度にとどめてください。</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. 著作権について</Text>
          <Text style={styles.body}>
            本サービスは入力された英文の翻訳・構造解析を行う学習補助ツールです。教材や書籍の代替を意図するものではありません。入力は1回あたり数文に制限されており、大量のテキストを処理する機能はありません。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. データの取り扱い</Text>
          <Text style={styles.body}>
            入力された画像・テキスト・解析結果はサーバーに保存されません。AIによる処理完了後、直ちに破棄されます。詳しくはプライバシーポリシーをご確認ください。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. 免責事項</Text>
          <Text style={styles.body}>・AIによる翻訳・解析結果の正確性は保証しません。</Text>
          <Text style={styles.body}>・本サービスの利用により生じた損害について責任を負いません。</Text>
          <Text style={styles.body}>・サービスの提供を予告なく中断・終了する場合があります。</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>6. 規約の変更</Text>
          <Text style={styles.body}>
            本規約は予告なく変更される場合があります。変更後の規約は本ページに掲載した時点で効力を生じます。
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
