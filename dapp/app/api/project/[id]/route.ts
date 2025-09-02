 import { NextResponse } from "next/server";
 import { connectDB } from "@/database/db";
 import { updateProjectById } from "@/controller/controller";

export async function PUT(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
 
  const body = await request.json();

  try {
    await connectDB();

    const updated = await updateProjectById(
      id,
       {  isTokenized: body.isTokenized,
          owner: body.owner,
          contractAddress: body.contractAddress,
          ipfsCID: body.ipfsCID,
          tokenizedAt: new Date(),
        }
    );

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated }, { status: 200 });
  } catch (err) {
    console.error("Error updating project:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}