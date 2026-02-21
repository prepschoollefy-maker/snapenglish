import { NextResponse } from "next/server";
import { analyzeImage, analyzeText } from "@/lib/ai";
import { ApiResponse } from "@/lib/types";

// インメモリレート制限
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1分
const RATE_LIMIT_MAX = 10; // 1分あたり10リクエスト

// 画像サイズ上限（約5MB base64）
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 * 1.37; // base64 overhead

// テキスト入力の文字数上限
const MAX_TEXT_LENGTH = 2000;

const CACHE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
};

function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp;
    // ローカル開発時はヘッダーが無いため、127.0.0.1をフォールバックとする
    return "127.0.0.1";
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return false;
    }

    entry.count++;
    return true;
}

export async function POST(request: Request) {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    try {
        // レート制限チェック
        const ip = getClientIp(request);
        if (!checkRateLimit(ip)) {
            console.error(JSON.stringify({
                requestId,
                timestamp: new Date().toISOString(),
                error: "RATE_LIMITED",
            }));
            return NextResponse.json<ApiResponse>(
                { success: false, error: "RATE_LIMITED" },
                { status: 429, headers: CACHE_HEADERS }
            );
        }

        const body = await request.json();
        const { image, text } = body;

        if ((!image || typeof image !== "string") && (!text || typeof text !== "string")) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "API_ERROR" },
                { status: 400, headers: CACHE_HEADERS }
            );
        }

        let data;

        if (text) {
            // テキスト入力の場合
            if (text.length > MAX_TEXT_LENGTH) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: "TEXT_TOO_LONG" },
                    { status: 400, headers: CACHE_HEADERS }
                );
            }
            data = await analyzeText(text);
        } else {
            // 画像入力の場合
            if (image.length > MAX_IMAGE_SIZE) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: "TEXT_TOO_LONG" },
                    { status: 400, headers: CACHE_HEADERS }
                );
            }
            data = await analyzeImage(image);
        }

        console.error(JSON.stringify({
            requestId,
            timestamp: new Date().toISOString(),
            status: "success",
            latencyMs: Date.now() - startTime,
        }));

        return NextResponse.json<ApiResponse>(
            { success: true, data },
            { headers: CACHE_HEADERS }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "";
        const errorCategory =
            errorMessage === "NO_TEXT_FOUND"
                ? "NO_TEXT_FOUND"
                : errorMessage === "RATE_LIMITED"
                    ? "RATE_LIMITED"
                    : errorMessage === "SERVICE_UNAVAILABLE"
                        ? "SERVICE_UNAVAILABLE"
                        : "API_ERROR";

        // メタデータのみログ（ユーザーコンテンツを含めない）
        console.error(JSON.stringify({
            requestId,
            timestamp: new Date().toISOString(),
            error: errorCategory,
            latencyMs: Date.now() - startTime,
        }));

        if (errorCategory === "NO_TEXT_FOUND") {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "NO_TEXT_FOUND" },
                { status: 200, headers: CACHE_HEADERS }
            );
        }

        if (errorCategory === "RATE_LIMITED") {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "RATE_LIMITED" },
                { status: 429, headers: CACHE_HEADERS }
            );
        }

        if (errorCategory === "SERVICE_UNAVAILABLE") {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "SERVICE_UNAVAILABLE" },
                { status: 503, headers: CACHE_HEADERS }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: false, error: "API_ERROR" },
            { status: 500, headers: CACHE_HEADERS }
        );
    }
}
