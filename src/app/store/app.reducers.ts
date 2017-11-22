import { ActionReducerMap } from "@ngrx/store";

import * as AppActions from './app.actions';
import * as fromHome from '../home/store/home.reducers';
import * as fromChannel from '../channel/store/channel.reducers';
import * as fromProfile from '../profile/store/profile.reducers';

export enum Page {
  White, Home, Profile, Channel
}

export interface NavState {
  currentPage: Page,
  navTo: Page
}

const initialState: NavState = {
  currentPage: Page.White,
  navTo: null
}

export interface AppState {
  nav: NavState,
  profile: fromProfile.State,
  home: fromHome.State,
  channel: fromChannel.State
}


export function appReducer(state = initialState, action: AppActions.AppActions) {
  switch (action.type) {
    case AppActions.NAVIGATE_TO:
      return {
        ...state,
        navTo: action.payload
      };
    case AppActions.NAVIGATED:
      return {
        ...state,
        currentPage: action.payload,
        navTo: null
      };
    default: return state;
  }
}

export const reducers: ActionReducerMap<AppState> = {
  nav: appReducer,
  profile: fromProfile.profileReducer,
  home: fromHome.homeReducer,
  channel: fromChannel.channelReducer
}
