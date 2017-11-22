import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { ServerService } from '../../service/server.service';
import * as fromApp from '../../store/app.reducers';
import * as HomeActions from './home.actions';

@Injectable()
export class HomeEffects {
  constructor(private actions$: Actions,
    private server: ServerService,
    private store: Store<fromApp.AppState>) { }

  @Effect({ dispatch: false })
  performSearchRequest = this.actions$
    .ofType(HomeActions.TRY_SEARCH)
    .map((action: HomeActions.TrySearch) => action.payload)
    .do((data) => this.server.search(data));

  @Effect({ dispatch: false })
  hideRefresherSpinner = this.actions$
    .ofType(HomeActions.SEARCH_SUCCESS)
    .withLatestFrom(this.store.select('home'))
    .do(([action, homeState]) => homeState.refresher && homeState.refresher.complete());
}
