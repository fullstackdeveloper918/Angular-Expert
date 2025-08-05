import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(req: Request) {
  try {
    const { companyName } = await req.json();

    if (!companyName) {
      return NextResponse.json({ message: "Missing companyName" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "utils", "companyNames.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: "Company data file not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");

    let companyData: Record<string, any> = {};

    try {
      companyData = JSON.parse(fileContent);
    } catch (err) {
      return NextResponse.json({ message: "JSON parse error" }, { status: 500 });
    }
    const keyToDelete = Object.keys(companyData).find(
      key => companyData[key] === companyName || key === companyName
    );
    
    if (!keyToDelete) {
      return NextResponse.json({ message: "Company not found" }, { status: 400 });
    }
    
    delete companyData[keyToDelete];

    fs.writeFileSync(filePath, JSON.stringify(companyData, null, 2));

    return NextResponse.json({ message: "Company deleted successfully" }, { status: 200 });

  } catch (err: any) {
    console.error("DELETE API error:", err);
    return NextResponse.json({ message: "Failed to delete company", error: err.message }, { status: 500 });
  }
}
