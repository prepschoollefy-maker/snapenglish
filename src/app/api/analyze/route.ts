import { NextResponse } from "next/server";
import { analyzeImage } from "@/lib/ai";
import { ApiResponse } from "@/lib/types";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image } = body;

        if (!image || typeof image !== "string") {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "API_ERROR" },
                { status: 400 }
            );
        }

        const data = await analyzeImage(image);

        return NextResponse.json<ApiResponse>({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Analyze API error:", error);

        if (error instanceof Error && error.message === "NO_TEXT_FOUND") {
            return NextResponse.json<ApiResponse>(
                { success: false, error: "NO_TEXT_FOUND" },
                { status: 200 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: false, error: "API_ERROR" },
            { status: 500 }
        );
    }
}
