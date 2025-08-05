import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { key, value } = await req.json();

    const filePath = path.join(process.cwd(), "utils", "companyNames.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const companyData = JSON.parse(fileContent);

    companyData[key] = value;

    fs.writeFileSync(filePath, JSON.stringify(companyData, null, 2));

    return NextResponse.json({ message: "Company added" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
