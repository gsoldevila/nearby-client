import { Action } from "@ngrx/store";

import { Channel } from "../../model/channel.model";
import { Message } from "../../model/message.model";
import { User } from "../../model/user.model";

export const TRY_CREATE_CHANNEL = 'NEARBY_TRY_CREATE_CHANNEL';
export const TRY_OPEN_CHANNEL = 'NEARBY_TRY_OPEN_CHANNEL';
export const OPEN_CHANNEL = 'NEARBY_OPEN_CHANNEL';
export const ENTER_CHANNEL_ERROR = 'NEARBY_ENTER_CHANNEL_ERROR';
export const GOTO_CHANNEL = 'NEARBY_GOTO_CHANNEL';
export const GET_CHANNEL_INFO = 'NEARBY_GET_CHANNEL_INFO';
export const SEND_MESSAGE = 'NEARBY_SEND_MESSAGE';
export const MESSAGE_RECEIVED = 'NEARBY_MESSAGE_RECEIVED';
export const CONNECTION_LOST = 'NEARBY_CONNECTION_LOST';
export const CONNECTION_RESTORED = 'NEARBY_CONNECTION_RESTORED';
export const LEAVE_CURRENT_CHANNEL = 'NEARBY_LEAVE_CURRENT_CHANNEL';
export const LEAVE_CHANNEL = 'NEARBY_LEAVE_CHANNEL';

export class TryCreateChannel implements Action {
  readonly type = TRY_CREATE_CHANNEL;
  constructor(public payload: string) { }
}

export class TryOpenChannel implements Action {
  readonly type = TRY_OPEN_CHANNEL;
  constructor(public payload: Channel) { }
}

export class OpenChannel implements Action {
  readonly type = OPEN_CHANNEL;
  constructor(public payload: Channel) { }
}

export class EnterChannelError implements Action {
  readonly type = ENTER_CHANNEL_ERROR;
  constructor(public payload: Error) { }
}

export class GotoChannel implements Action {
  readonly type = GOTO_CHANNEL;
  constructor(public payload: Channel) { }
}

export class GetChannelInfo implements Action {
  readonly type = GET_CHANNEL_INFO;
  constructor(public payload: Channel) { }
}

export class SendMessage implements Action {
  readonly type = SEND_MESSAGE;
  constructor(public payload: { channel: string, message: string }) { }
}

export class MessageReceived implements Action {
  readonly type = MESSAGE_RECEIVED;
  constructor(public payload: Message) { }
}

export class ConnectionLost implements Action {
  readonly type = CONNECTION_LOST;
  constructor(public payload: User) { }
}

export class ConnectionRestored implements Action {
  readonly type = CONNECTION_RESTORED;
  constructor(public payload: User) { }
}

export class LeaveCurrentChannel implements Action {
  readonly type = LEAVE_CURRENT_CHANNEL;
  constructor(public payload: Channel) { }
}

export class LeaveChannel implements Action {
  readonly type = LEAVE_CHANNEL;
  constructor(public payload: Channel) { }
}

export type ChannelActions = TryCreateChannel |
  TryOpenChannel |
  OpenChannel |
  EnterChannelError |
  GotoChannel |
  MessageReceived |
  ConnectionLost |
  ConnectionRestored |
  LeaveCurrentChannel |
  LeaveChannel;
