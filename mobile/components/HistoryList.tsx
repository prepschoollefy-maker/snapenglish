import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { HistoryItem } from "../lib/types";

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClearAll: () => void;
}

export default function HistoryList({
  items,
  onSelect,
  onClearAll,
}: HistoryListProps) {
  if (items.length === 0) return null;

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const sentenceCount = item.data.sentences.length;
    const phraseCount = item.data.key_phrases.length;

    return (
      <Pressable
        onPress={() => onSelect(item)}
        style={({ pressed }) => [styles.itemButton, pressed && styles.itemPressed]}
      >
        {item.thumbnail ? (
          <View style={styles.thumbnailContainer}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          </View>
        ) : null}
        <View style={styles.itemContent}>
          <Text style={styles.itemLabel} numberOfLines={1}>
            {item.label}
          </Text>
          <Text style={styles.itemMeta}>
            {sentenceCount > 0 && `${sentenceCount}文`}
            {sentenceCount > 0 && phraseCount > 0 && " · "}
            {phraseCount > 0 && `${phraseCount}語句`}
          </Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View style={styles.headerLine} />
          <Text style={styles.headerText}>最近の解析</Text>
          <View style={[styles.headerLine, styles.headerLineFlex]} />
        </View>
        <Pressable onPress={onClearAll} hitSlop={8}>
          <Text style={styles.clearText}>全て削除</Text>
        </Pressable>
      </View>

      {/* リスト */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLine: {
    width: 32,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerLineFlex: {
    flex: 1,
  },
  headerText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontWeight: "500",
  },
  clearText: {
    color: "rgba(248,113,113,0.6)",
    fontSize: 12,
    marginLeft: 8,
  },
  separator: {
    height: 8,
  },
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  itemPressed: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  thumbnailContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  thumbnail: {
    width: 48,
    height: 48,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  itemMeta: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    marginTop: 2,
  },
  arrow: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 18,
  },
});
