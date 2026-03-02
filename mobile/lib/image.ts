import * as ImageManipulator from "expo-image-manipulator";

/**
 * 画像をリサイズしてbase64 data URLとして返す
 */
async function resizeImage(
  uri: string,
  maxSize: number,
  compress: number
): Promise<string> {
  // まず画像の情報を取得するためにリサイズ
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxSize } }],
    { compress, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  return `data:image/jpeg;base64,${result.base64}`;
}

/**
 * API送信用に画像を圧縮（長辺1600px, JPEG品質0.8）
 */
export function compressForApi(uri: string): Promise<string> {
  return resizeImage(uri, 1600, 0.8);
}

/**
 * サムネイル用に画像を圧縮（長辺300px, JPEG品質0.6）
 */
export function compressForThumbnail(uri: string): Promise<string> {
  return resizeImage(uri, 300, 0.6);
}
