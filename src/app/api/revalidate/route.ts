import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: "Path is required" },
        { status: 400 }
      );
    }

    // Revalidate the specified path
    revalidatePath(path);

    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    console.error("Error revalidating:", error);
    return NextResponse.json(
      { error: "Error revalidating" },
      { status: 500 }
    );
  }
}
