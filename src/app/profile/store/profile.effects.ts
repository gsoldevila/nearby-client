import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { ServerService } from '../../service/server.service';
import * as fromApp from '../../store/app.reducers';
import * as AppActions from '../../store/app.actions';
import * as ProfileActions from './profile.actions';
import { User } from '../../model/user.model';

@Injectable()
export class ProfileEffects {
  constructor(private actions$: Actions, private server: ServerService, private storage: Storage) { }

  @Effect({ dispatch: false })
  sendUserToServer = this.actions$
    .ofType(ProfileActions.TRY_UPDATE_USER)
    .map((action: ProfileActions.TryUpdateUser) => action.payload)
    .do((user: User) => this.server.updateUser(user));

  @Effect()
  storeNewUserAndGoHome = this.actions$
    .ofType(ProfileActions.UPDATE_USER_SUCCESS)
    .map((action: ProfileActions.TryUpdateUser) => action.payload)
    .map((user: User) => {
      this.storage.set('Nearby-user', user)
      return new AppActions.NavigateTo(fromApp.Page.Home);
    });

  @Effect()
  goHomeAfterRestoring = this.actions$
    .ofType(ProfileActions.RESTORE_USER)
    .map(() => new AppActions.NavigateTo(fromApp.Page.Home));
}
