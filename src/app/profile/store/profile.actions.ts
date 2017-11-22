import { Action } from "@ngrx/store";
import { User } from "../../model/user.model";

export const RESTORE_USER = 'NEARBY_RESTORE_USER';
export const TRY_UPDATE_USER = 'NEARBY_TRY_UPDATE_USER';
export const UPDATE_USER_SUCCESS = 'NEARBY_UPDATE_USER_SUCCESS';
export const UPDATE_USER_ERROR = 'NEARBY_UPDATE_USER_ERROR';


export class RestoreUser implements Action {
  readonly type = RESTORE_USER;
  constructor(public payload: User) { }
}

export class TryUpdateUser implements Action {
  readonly type = TRY_UPDATE_USER;
  constructor(public payload: User) { }
}

export class UpdateUserSuccess implements Action {
  readonly type = UPDATE_USER_SUCCESS;
  constructor(public payload: User) { }
}

export class UpdateUserError implements Action {
  readonly type = UPDATE_USER_ERROR;
  constructor(public payload: Error) { }
}

export type ProfileActions = RestoreUser | TryUpdateUser | UpdateUserSuccess | UpdateUserError;
