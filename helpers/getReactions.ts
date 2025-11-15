import { sql } from "@/app/database/db";
import { getMessageInfo } from "./messageInfo";
import { getRooms } from "./getRooms";

import { DatabaseMessages, MessageReactions, DatabaseReactions } from "@/types";

export async function getReactions(userId: number, messageId: number) {
    if (!messageId || messageId <= 0) {
        return JSON.stringify(
            {
                "error": "You need a valid message Id",
                "status": 400
            }
        );
    };

    const userRooms: string[] = await getRooms(userId);
    const messageData: DatabaseMessages|null = await getMessageInfo(messageId);

    if (messageData === null) {
        return JSON.stringify(
            {
                "error": "Something went wrong getting message data",
                "status": 500
            }
        );
    };

    const messageRoomId: number = messageData["roomid"];

    if (!userRooms.includes(messageRoomId.toString())) {
        return JSON.stringify(
            {
                "error": "You are not in the messages room",
                "status": 403 
            }
        );
    };

    let result: DatabaseReactions[];

    try {
        result = await sql`SELECT * FROM reactions WHERE messageid=${messageId}`;
    } catch (e) {
        return JSON.stringify(
            {
                "error": "Something went wrong getting reaction info",
                "status": 500
            }
        );
    };

    const reactions: MessageReactions = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    for (let i = 0; i < result.length; i++) {
        const thisReaction: DatabaseReactions = result[i];
        const reactionType: number = thisReaction["reaction"];

        reactions[reactionType as keyof typeof reactions].push(thisReaction["userid"]);
    };

    return JSON.stringify(
        {
            "reactions": reactions,
            "status": 200
        }
    );
};