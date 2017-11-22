import { User } from "./user.model";

export class Message {
  constructor(public author: User, public channel: string, public content: string, public timestamp: number = Date.now()) { }
}
