import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/mongodb/db";
import { verifyTenantPermission } from "@/modules/rbac";
import { Tenant } from "@/modules/tenants";

// Ensure server-side configuration using private env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get("file");
    const tenantSlug =
      req.headers.get("x-tenant-slug") || formData.get("tenantSlug");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (tenantSlug) {
      const tenant = await Tenant.findOne({ slug: tenantSlug });
      if (tenant) {
        const authResult = await verifyTenantPermission(req, tenant._id);
        if (!authResult.authorized) {
          return authResult.response;
        }
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: tenantSlug ? `webxode/${tenantSlug}` : "webxode/general",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(
      {
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
