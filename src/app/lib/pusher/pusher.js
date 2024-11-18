import PusherServer from "pusher"
import PusherClient from "pusher-js"

export const pusherServer = new PusherServer({
    app_id : process.env.PUSHER_ID,
    app_key : process.env.PUSHER_KEY,
    app_secret:process.env.PUSHER_SECRET,
    cluster : process.env.PUSHER_CLUSTER,
    useTLS : true
})
export const pusherClient  = new PusherClient(
    process.env.PUSHER_KEY,
    {
        cluster : process.env.PUSHER_CLUSTER,
    }
)