import { Guid } from "guid-typescript";

export class ChatMessage {
    senderId: string;
    name: string;
    text: string;
    id: string;
    public constructor(init?: Partial<ChatMessage>) {
        Object.assign(this, init);
    }
}