import { ActionReducer } from '@ngrx/store';
import { storageSync } from 'ngrx-store-ionic-storage';

import * as HomeActions from '../home/store/home.actions';
import * as ChannelActions from '../channel/store/channel.actions';

export const storageSyncReducer = storageSync({
  keys: ['profile'],                    // Only sync the `profile` state
  ignoreActions: [                      // Don't sync when these actions occur
    HomeActions.TRY_SEARCH,
    HomeActions.SEARCH_SUCCESS,
    ChannelActions.TRY_CREATE_CHANNEL,
    ChannelActions.TRY_OPEN_CHANNEL,
    ChannelActions.OPEN_CHANNEL,
    ChannelActions.ENTER_CHANNEL_ERROR,
    ChannelActions.GOTO_CHANNEL,
    ChannelActions.SEND_MESSAGE,
    ChannelActions.LEAVE_CHANNEL,
    ChannelActions.MESSAGE_RECEIVED,
    ChannelActions.CONNECTION_LOST,
    ChannelActions.CONNECTION_RESTORED
  ],
  hydratedStateKey: 'hydrated',         // Add this key to the state
  onSyncError: err => console.log(err)  // If a sync fails
});

export function storageMetaReducer(reducer: ActionReducer<any, any>): ActionReducer<any, any> {
  return storageSyncReducer(reducer);
}

export function simpleLogMetaReducer(reducer: ActionReducer<any, any>): ActionReducer<any, any> {
  return function newReducer(state, action) {
    console.log('[NgRxStore action]: ' + action.type);
    const nextState = reducer(state, action);
    return nextState
  }
}

export function logMetaReducer(reducer: ActionReducer<any, any>): ActionReducer<any, any> {
  return function newReducer(state, action) {
    console.groupCollapsed(action.type);
    const nextState = reducer(state, action);
    console.log(`%c prev state`, `color: #9E9E9E; font-weight: bold`, state);
    console.log(`%c action`, `color: #03A9F4; font-weight: bold`, action);
    console.log(`%c next state`, `color: #4CAF50; font-weight: bold`, nextState);
    console.groupEnd();
    return nextState;
  }
}
