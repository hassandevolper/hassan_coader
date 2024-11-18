import { fetchRedis } from "./redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
export const getfriendsbyid = async () => {
    const session = await getServerSession(authOptions)
  const friendsid = await fetchRedis('smembers', `${session.user.id}:friends`);
  
  if (!friendsid || friendsid.length === 0) {
    // Return an empty array if no friends are found
    return [];
  }

  const friends = await Promise.all(
    friendsid.map(async (friendid) => {
      const friendData = await fetchRedis('get', `${friendid}`);
      console.log("friendData",friendData);
      
      
      // Check if friendData exists and parse it if needed
      if (friendData) {
        try {
          const friend = JSON.parse(friendData);
          return friend;
        } catch (error) {
          console.error('Error parsing friend data:', error);
          return null;
        }
      }
      return null; // Return null if friendData doesn't exist
    })
  );

  // Filter out any null values in case some friends couldn't be fetched
  return friends.filter((friend) => friend !== null);
};
