import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Admin logged out successfully" },
    { status: 200 }
  );

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
