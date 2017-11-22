import * as ProfileActions from "./profile.actions";
import { User } from "../../model/user.model";

export interface State {
  user: User,
  exists: boolean,
  saving: boolean,
}

const initialState: State = {
  user: null,
  exists: false,
  saving: false
};

export function profileReducer(state: State = initialState, action: ProfileActions.ProfileActions) {
  switch (action.type) {
    case ProfileActions.TRY_UPDATE_USER:
      return {
        ...state,
        saving: true
      };
    case ProfileActions.RESTORE_USER:
    case ProfileActions.UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: { ...action.payload },
        exists: true,
        saving: false
      };
    case ProfileActions.UPDATE_USER_ERROR:
      return {
        ...state,
        saving: false
      }
    default:
      return state;
  }
}
