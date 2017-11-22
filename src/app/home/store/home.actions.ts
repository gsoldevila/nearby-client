import { Action } from "@ngrx/store";
import { Refresher } from "ionic-angular";
import { Channel } from "../../model/channel.model";
import { NearbyPosition } from "../../service/position.service";

export const TRY_SEARCH = 'NEARBY_TRY_SEARCH';
export const SEARCH_SUCCESS = 'NEARBY_SEARCH_SUCCESS';

export class TrySearch implements Action {
  readonly type = TRY_SEARCH;
  constructor(public payload: { position?: NearbyPosition, range: number, text: string }, public refresher: Refresher) { }
}

export class SearchSuccess implements Action {
  readonly type = SEARCH_SUCCESS;
  constructor(public payload: Channel[]) { }
}

export type HomeActions = TrySearch | SearchSuccess;
