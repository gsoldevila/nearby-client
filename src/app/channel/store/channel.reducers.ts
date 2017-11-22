import * as AppActions from "../../store/app.actions";
import * as fromApp from "../../store/app.reducers";
import * as ChannelActions from "./channel.actions";
import { Channel } from "../../model/channel.model";
import { Message } from "../../model/message.model";

export interface State {
  openChannels: Channel[],
  currentChannel: Channel,
  unread: number
}

const initialState = {
  openChannels: [],
  currentChannel: null,
  unread: 0
};

export function channelReducer(state = initialState, action: AppActions.AppActions | ChannelActions.ChannelActions) {
  switch (action.type) {
    case AppActions.NAVIGATED:
      // when we navigate away from a channel, unset the current channel
      if (action.payload !== fromApp.Page.Channel) {
        return {
          ...state,
          currentChannel: null
        };
      }
      break;
    case ChannelActions.OPEN_CHANNEL:
      action.payload.unread = 0; // initialize the unread counter
      const updatedChannels = [...state.openChannels];
      updatedChannels.push(action.payload);
      return {
        ...state,
        currentChannel: action.payload,
        openChannels: updatedChannels
      };
    case ChannelActions.GOTO_CHANNEL:
      if (!state.unread) state.unread = 0;
      if (!action.payload.unread) action.payload.unread = 0;
      let globalUnread = state.unread - action.payload.unread;
      action.payload.unread = 0;
      return {
        ...state,
        currentChannel: action.payload,
        unread: globalUnread
      };
    case ChannelActions.MESSAGE_RECEIVED:
      const destChannel = state.openChannels.find(candidate => candidate.name.toUpperCase() === action.payload.channel);
      if (destChannel) {
        // add the message to the target channel
        destChannel.messages.push(action.payload);
        if (destChannel !== state.currentChannel) {
          // increment the unread counters
          ++destChannel.unread;
          ++state.unread;
        }
        return { ...state };
      }
      break;
    case ChannelActions.LEAVE_CURRENT_CHANNEL:
    case ChannelActions.LEAVE_CHANNEL:
      const idx = state.openChannels.findIndex(candidate => candidate.name === action.payload.name);
      if (idx >= 0) {
        let [leaving] = state.openChannels.splice(idx, 1);
        state.unread -= leaving.unread;
      }
      break;
    case ChannelActions.CONNECTION_LOST:
      state.openChannels.forEach(channel => {
        const msg = new Message(action.payload, channel.name, 'Connection lost');
        channel.messages.push(msg);
      });
      // TODO store open channels in the state to allow restoring them later on?
      return {
        ...state,
        openChannels: [],
        currentChannel: null,
        unread: 0
      };
    case ChannelActions.CONNECTION_RESTORED:
    // state.openChannels.forEach(channel => {
    //   const msg = new Message(action.payload, channel.name, 'Connection restored');
    //   channel.messages.push(msg);
    // });
    // return {
    //   ...state,
    // };
  }
  return state;
}
