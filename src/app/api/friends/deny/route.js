import z from "zod";
import { db } from "@/app/utils/redis_db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const POST = async (req) => {
  try {
    const payload = await req.json();

    // Define and validate schema
    const idSchema = z.object({ id: z.string() });
    const parseResult = idSchema.safeParse(payload);

    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.format());
      return new Response("Invalid input: 'id' must be a string and is required.", { status: 400 });
    }

    const { id } = parseResult.data;

    // Check session
    const session = await getServerSession(authOptions);
    if (!session) {
      console.warn("Unauthorized access attempt.");
      return new Response("Unauthorized", { status: 401 });
    }

    // Remove incoming friend request
    await db.srem(`${session.user.id}:incoming_friend_request`, id);
    return new Response("Ok");

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
