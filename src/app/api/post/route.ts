import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { postRebeal } from "@/firebase/firestore/rebeals";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session === null)
    return NextResponse.json({ message: "you need to login" });
  if (session.user === undefined)
    return NextResponse.json({ message: "no user found for your session" });

  const formData = await request.formData();

  const main = formData.get("mainImage");
  const selfie = formData.get("selfie");
  const _postedAt = formData.get("postedAt");

  // validate
  if (main === null)
    return NextResponse.json({
      message: "formdata main image returned null",
    });
  if (selfie === null)
    return NextResponse.json({
      message: "formdata selfie image returned null",
    });
  if (_postedAt === null)
    return NextResponse.json({
      message: "formdata postedAt returned null",
    });

  if (typeof main === "string")
    return NextResponse.json({
      message: "formdata mainImage is string",
    });
  if (typeof selfie === "string")
    return NextResponse.json({
      message: "formdata selfie is string",
    });
  if (typeof _postedAt !== "string")
    return NextResponse.json({
      message: "formdatat postedAt is not a string",
    });

  const postedAt = z.number().min(1687096843463).parse(parseInt(_postedAt));

  let documentId: string;
  try {
    documentId = await postRebeal({
      mainImage: main,
      selfie: selfie,
      postedAt: postedAt,
      userId: session.user.id,
    });
  } catch (error) {
    return NextResponse.json({
      message: "failed uploading rebeal",
      error,
    });
  }

  return NextResponse.json({ success: documentId });
}
