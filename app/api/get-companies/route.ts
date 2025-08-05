import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "utils", "companyNames.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const companyData = JSON.parse(fileContent);

    return NextResponse.json({ data: companyData }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
