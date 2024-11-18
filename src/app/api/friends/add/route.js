import { fetchRedis } from "@/app/helper/redis";
import { emailvalidator } from "@/app/lib/validation";
import { db } from "@/app/utils/redis_db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";
import { pusherServer } from "@/app/lib/pusher/pusher";
import { PusherKey } from "@/app/lib/utils/utils";
export const POST = async (req) => {
  try {
    const payload = await req.json();
    console.log("Received payload:", payload);

    // Validate email format
    const { email } = emailvalidator.parse(payload);
    console.log("Validated email:", email);

    // Fetch user ID from Redis
    const idToAdd = await fetchRedis(`get`, `user:${email}`);
    console.log("Fetched ID to Add:", idToAdd);

    if (!idToAdd) {
      return new Response("This user does not exist.", { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      console.error("No session found or session ID is missing.");
      return new Response("Unauthorized user", { status: 401 });
    }

    console.log("Session User ID:", session.user.id);

    // Prevent user from adding themselves
    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", { status: 400 });
    }

    const incomingRequestKey = `user:${email}:incoming_friend_request`;
    const friendsKey = `${session.user.id}:friends`;

    // Check if a friend request already exists
    const isAlreadyRequested = await fetchRedis("sismember", incomingRequestKey, session.user.id);
    console.log("Is Already Requested:", isAlreadyRequested);

    if (isAlreadyRequested === 1) {
      console.log("Friend request already exists.");
      return new Response("User already requested as friend", { status: 400 });
    }

    // Check if the user is already a friend
    const isAlreadyFriend = await fetchRedis("sismember", friendsKey, idToAdd);
    console.log("Is Already Friend:", isAlreadyFriend);

    if (isAlreadyFriend === 1) {
      console.log("User is already a friend.");
      return new Response("User is already a friend", { status: 400 });
    }

    console.log("Adding to incoming friend request:", incomingRequestKey, session.user.id);


    // Send the friend request by adding to incoming friend request list
    await db.sadd(incomingRequestKey, session.user.id);
    console.log("Friend request sent successfully to:", idToAdd);

    return new Response("Friend request sent successfully", { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.errors[0].message);
      return new Response(error.errors[0].message, { status: 400 });
    }
    console.error("Unhandled Error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};