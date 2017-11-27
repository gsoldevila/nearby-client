import { Refresher } from "ionic-angular";

import * as HomeActions from "./home.actions";
import * as ChannelActions from "../../channel/store/channel.actions";
import { Channel } from "../../model/channel.model";

export interface State {
  nearbyChannels: Channel[],
  refresher: Refresher,
}

const initialState = {
  nearbyChannels: [],
  refresher: null,
};

export function homeReducer(state = initialState, action: HomeActions.HomeActions | ChannelActions.ChannelActions) {
  switch (action.type) {
    case HomeActions.TRY_SEARCH:
      return {
        ...state,
        refresher: action.refresher
      };
    case HomeActions.SEARCH_SUCCESS:
      // merge open channels into nearbyChannels, to preserve unread counters and messages
      let mergedNearby = action.payload.map((ch: Channel) => {
        let previous = state.nearbyChannels.find((ch2: Channel) => ch.name === ch2.name);
        if (previous && previous.online) {
          previous.position = ch.position;
          return previous;
        }
        return ch;
      });
      return {
        ...state,
        nearbyChannels: mergedNearby
      };
    case ChannelActions.OPEN_CHANNEL:
      // the user has created / opened a channel => update it on the nearby list
      let updatedNearby = [...state.nearbyChannels];
      let index = updatedNearby.findIndex((ch: Channel) => ch.name === action.payload.name);
      if (index < 0) {
        // it's a newly created channel => add it to the home page as well
        updatedNearby.splice(0, 0, action.payload);
      } else {
        // channel selected from the homepage => update it
        updatedNearby.splice(index, 1, action.payload);
      }
      return {
        ...state,
        nearbyChannels: updatedNearby
      };
    case ChannelActions.LEAVE_CURRENT_CHANNEL:
    case ChannelActions.LEAVE_CHANNEL:
      // when leaving a channel which is present in the list, remove the online flag
      let ch = state.nearbyChannels.find((ch: Channel) => ch.name === action.payload.name);
      if (ch) ch.online = false;
      return { ...state };
    case ChannelActions.CONNECTION_LOST:
      state.nearbyChannels.forEach((ch: Channel) => ch.online = false);
      return { ...state };
  }
  return state;
}
