import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SentenceAnalysis } from "../lib/types";

interface SentenceSelectorProps {
  sentences: SentenceAnalysis[];
  onConfirm: (selectedIds: number[]) => void;
}

export default function SentenceSelector({
  sentences,
  onConfirm,
}: SentenceSelectorProps) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(sentences.map((s) => s.id))
  );

  const allSelected = selected.size === sentences.length;
  const noneSelected = selected.size === 0;

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(sentences.map((s) => s.id)));
  const deselectAll = () => setSelected(new Set());

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>解析する文を選択</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          解析結果を表示する文を選んでください
        </Text>

        {/* 全選択 / 全解除 */}
        <View style={styles.bulkActions}>
          <Pressable
            onPress={selectAll}
            disabled={allSelected}
            style={[styles.bulkButton, allSelected && styles.bulkButtonDisabled]}
          >
            <Text style={[styles.bulkButtonText, allSelected && styles.bulkButtonTextDisabled]}>
              全選択
            </Text>
          </Pressable>
          <Pressable
            onPress={deselectAll}
            disabled={noneSelected}
            style={[styles.bulkButton, noneSelected && styles.bulkButtonDisabled]}
          >
            <Text style={[styles.bulkButtonText, noneSelected && styles.bulkButtonTextDisabled]}>
              全解除
            </Text>
          </Pressable>
        </View>

        {/* 文リスト */}
        <View style={styles.sentenceList}>
          {sentences.map((sentence) => {
            const isSelected = selected.has(sentence.id);
            return (
              <Pressable
                key={sentence.id}
                onPress={() => toggle(sentence.id)}
                style={[
                  styles.sentenceItem,
                  isSelected ? styles.sentenceSelected : styles.sentenceUnselected,
                ]}
              >
                <View
                  style={[
                    styles.checkbox,
                    isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.sentenceText}>{sentence.original}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* 確定ボタン */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          onPress={() => onConfirm(Array.from(selected))}
          disabled={noneSelected}
          style={[
            styles.confirmButton,
            noneSelected && styles.confirmButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.confirmText,
              noneSelected && styles.confirmTextDisabled,
            ]}
          >
            {noneSelected
              ? "文を選択してください"
              : `解析結果を見る（${selected.size}文）`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  headerTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    marginBottom: 16,
  },
  bulkActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  bulkButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  bulkButtonDisabled: {
    opacity: 0.3,
  },
  bulkButtonText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  bulkButtonTextDisabled: {
    color: "rgba(255,255,255,0.3)",
  },
  sentenceList: {
    gap: 12,
  },
  sentenceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sentenceSelected: {
    backgroundColor: "rgba(59,130,246,0.1)",
    borderColor: "rgba(59,130,246,0.4)",
  },
  sentenceUnselected: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: "#3b82f6",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  checkboxUnselected: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  sentenceText: {
    flex: 1,
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  confirmText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  confirmTextDisabled: {
    color: "rgba(255,255,255,0.3)",
  },
});
