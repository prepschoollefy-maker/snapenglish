/**
 * 画像リサイズ・圧縮ユーティリティ
 * - API送信用: 長辺1600px, JPEG品質0.8
 * - サムネイル用: 長辺300px, JPEG品質0.6
 */

/**
 * 画像ファイルをリサイズしてbase64文字列として返す
 */
export function resizeImage(
    file: File,
    maxSize: number,
    quality: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let { width, height } = img;

                // 長辺がmaxSize以下ならそのまま
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas context not available"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                resolve(dataUrl);
            };
            img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"));
        reader.readAsDataURL(file);
    });
}

/**
 * API送信用に画像を圧縮（長辺1600px, JPEG品質0.8）
 */
export function compressForApi(file: File): Promise<string> {
    return resizeImage(file, 1600, 0.8);
}

/**
 * サムネイル用に画像を圧縮（長辺300px, JPEG品質0.6）
 */
export function compressForThumbnail(file: File): Promise<string> {
    return resizeImage(file, 300, 0.6);
}
