export const fetchRedis = async (command, ...args) => {
  try {
    // URL encoding the arguments
    const encodedArgs = args.map(arg => encodeURIComponent(arg));
    const commandUrl = `${process.env.UPSTASH_REDIS_REST_URL}/${command}/${encodedArgs.join('/')}`;
    console.log("Command URL:", commandUrl);

    const response = await fetch(commandUrl, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from Redis: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Redis Response Data:", data);

    // Return data.result if it exists, regardless of its value (0, 1, or an array)
    if ('result' in data) {
      return data.result;
    }

    return null; // Handle cases where response is missing expected data
  } catch (error) {
    console.error("Error in fetchRedis:", error);
    throw error;
  }
};
