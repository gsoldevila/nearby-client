import { Message } from "./message.model";
import { User } from "./user.model";
import { NearbyPosition } from "../service/position.service";

export class Channel {
  public online: boolean;
  public unread: number;

  constructor(public name: string, public timestamp: number, public creator: User, public position?: NearbyPosition, public messages: Message[] = []) {
    this.online = false; // whether the user is inside the channel
    this.unread = 0; // # of unread messages on this channel
  }
}
