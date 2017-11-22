import { Action } from "@ngrx/store";
import * as fromApp from "./app.reducers";
import { User } from "../model/user.model";

export const SET_USER = 'NEARBY_SET_USER';
export const NAVIGATE_TO = 'NEARBY_NAVIGATE_TO';
export const NAVIGATED = 'NEARBY_NAVIGATED';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) { }
}
export class NavigateTo implements Action {
  readonly type = NAVIGATE_TO;
  constructor(public payload: fromApp.Page) { }
}

export class Navigated implements Action {
  readonly type = NAVIGATED;
  constructor(public payload: fromApp.Page) { }
}

export type AppActions = NavigateTo | Navigated;
