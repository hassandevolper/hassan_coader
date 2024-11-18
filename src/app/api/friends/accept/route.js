import { getServerSession } from "next-auth";
import z from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
import { fetchRedis } from "@/app/helper/redis";
import { db } from "@/app/utils/redis_db";

export const POST = async (req) => {
  try {
    const payload = await req.json();
    console.log("accept_payload", payload);
    
    // Validate input to ensure "id" is present in the payload and is a string
    const idSchema = z.object({ id: z.string() });
    const parseResult = idSchema.safeParse(payload);

    if (!parseResult.success) {
      console.log("Validation failed:", parseResult.error.format());
      return new Response("Invalid input: 'id' must be a string and is required.", { status: 400 });
    }

    const { id } = parseResult.data;

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("Unauthorized access attempt.");
      return new Response("Unauthorized", { status: 401 });
    }

    const friendsKey = `${session.user.id}:friends`;

    // Check if the user is already a friend
    const isAlreadyFriend = await fetchRedis("sismember", friendsKey, id);
    console.log("Is Already Friend:", isAlreadyFriend);
    if (isAlreadyFriend) {
      return new Response("Already Friend", { status: 400 });
    }

    // Check if there's a pending friend request from this user
    const hasIncomingFriendRequest = await fetchRedis(
      "sismember",
      `${session.user.id}:incoming_friend_request`,
      id
    );

    console.log("Has Incoming Friend Request:", hasIncomingFriendRequest);
    if (!hasIncomingFriendRequest) {
      return new Response("No friend request from this user", { status: 400 });
    }

    // Proceed with adding friend
    console.log("Incoming friend request confirmed. Proceeding with adding friend.");
    await db.sadd(`${session.user.id}:friends`, id);
    await db.sadd(`user:${id}:friends`, session.user.id);
    await db.srem(`${session.user.id}:incoming_friend_request`, id); //delete incomming friend request
    return new Response("OK");
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
