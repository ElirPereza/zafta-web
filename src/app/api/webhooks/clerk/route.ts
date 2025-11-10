import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET to your environment variables",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, public_metadata } = evt.data;

    const userEmail = email_addresses[0]?.email_address;
    const adminEmail = process.env.ADMIN_EMAIL;

    // Check if user is the designated admin by email
    const isSuperAdmin = adminEmail && userEmail === adminEmail;

    // Also check if user has admin role in metadata
    const hasAdminMetadata =
      public_metadata?.role === "admin" ||
      public_metadata?.role === "super_admin";

    // Determine role
    let role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" = "CUSTOMER";
    if (isSuperAdmin || public_metadata?.role === "super_admin") {
      role = "SUPER_ADMIN";
    } else if (hasAdminMetadata) {
      role = "ADMIN";
    }

    try {
      // Create user in database
      await prisma.userMetadata.create({
        data: {
          clerkId: id,
          role: role,
        },
      });

      console.log(
        `✅ User created in database: ${email_addresses[0].email_address} with role: ${role}`,
      );
    } catch (error) {
      console.error("Error creating user in database:", error);
      return new Response("Error creating user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.updated") {
    const { id, public_metadata } = evt.data;

    // Check if role was updated in metadata
    const hasAdminMetadata =
      public_metadata?.role === "admin" ||
      public_metadata?.role === "super_admin";

    // Determine role
    let role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" = "CUSTOMER";
    if (public_metadata?.role === "super_admin") {
      role = "SUPER_ADMIN";
    } else if (hasAdminMetadata) {
      role = "ADMIN";
    }

    try {
      // Update user role in database
      await prisma.userMetadata.update({
        where: {
          clerkId: id,
        },
        data: {
          role: role,
        },
      });

      console.log(`✅ User updated in database: ${id} with new role: ${role}`);
    } catch (error) {
      console.error("Error updating user in database:", error);
      return new Response("Error updating user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Delete user from database
      await prisma.userMetadata.delete({
        where: {
          clerkId: id as string,
        },
      });

      console.log(`✅ User deleted from database: ${id}`);
    } catch (error) {
      console.error("Error deleting user from database:", error);
      // Don't return error, user might not exist in DB
    }
  }

  return new Response("Webhook received", { status: 200 });
}
