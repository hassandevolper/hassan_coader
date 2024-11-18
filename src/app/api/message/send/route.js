import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { fetchRedis } from "@/app/helper/redis";
import { db } from "@/app/utils/redis_db";
import { nanoid } from "nanoid"; // ID generator
import { messageArrayValidator } from "@/app/lib/utils/messagevalidation";

export const POST = async (req) => {
    try {
        const body = await req.json();
        console.log("Request Body:", body);

        const { text, chatId } = body; // Ensure you're destructuring correctly
        if (!chatId || !chatId.includes('--')) {
            return new Response("Invalid chat ID", { status: 400 });
        }
        

        // Decode the chatid to handle any encoded characters
        const decodedChatId = decodeURIComponent(chatId);
        console.log('Decoded chat ID:', decodedChatId);

        // Get the session
        const session = await getServerSession(authOptions);
        console.log("Session:", session);  // Log session data to check if `session.user.id` exists

        if (!session || !session.user || !session.user.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        const [userid1, userid2] = decodedChatId.split('--');
        if (session.user.id !== userid1 && session.user.id !== userid2) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Determine friend ID
        const friendId = session.user.id === userid1 ? userid2 : userid1;

        // Check if friend exists in friend list
        const isFriend = await fetchRedis('sismember', `${session.user.id}:friends`, friendId);
        if (!isFriend) {
            return new Response("This user is not in your friend list", { status: 400 });
        }

        // Fetch sender details
        const senderData = await fetchRedis('get', `${session.user.id}`);
        console.log('Sender:', senderData);

        // Create message
        const timestamp = Date.now();
        const messageData = [
            {
            id: nanoid(),
            senderid: session.user.id, // Ensure this is being set correctly
            text,
            timestamp
}        
        ]

        // Validate message
        const message = messageArrayValidator.parse(messageData);

        // Log the Redis key and message
        console.log('Redis Key:', `chat:${decodedChatId}:messages`);
        console.log('Message to be stored:', JSON.stringify(message));

        // Add message to Redis sorted set
        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message),
          })
          return new Response("OK");
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        } else {
            return new Response('Internal server error', { status: 500 });
        }
    }
};
