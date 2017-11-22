import { App } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../store/app.reducers';
import * as fromProfile from './store/profile.reducers';
import * as ProfileActions from './store/profile.actions';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit {
  userForm: FormGroup;
  saving: boolean = false;
  private exists: boolean = false;
  private profileState: Observable<fromProfile.State>;

  constructor(private store: Store<AppState>, private _app: App) {
    // subscribe to profile changes
    this.profileState = this.store.select('profile');
  }

  ionViewDidEnter() {
    this._app.setTitle('Nearby - Profile');
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      'id': new FormControl(null, [Validators.pattern(/^(|1[0-9]{12})$/)]),
      'alias': new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+[0-9a-zA-Z_-\s]*$/)]),
      'firstName': new FormControl(null, [Validators.pattern(/^[a-zA-Z_-\s]*$/)]),
      'lastName': new FormControl(null, [Validators.pattern(/^[a-zA-Z_-\s]*$/)])
    });

    this.profileState.subscribe(profile => {
      if (profile.user) {
        this.userForm.setValue(profile.user);
      }
      this.exists = profile.exists;
      this.saving = profile.saving;
    });
  }

  onSubmit() {
    let user = this.userForm.getRawValue();
    this.store.dispatch(new ProfileActions.TryUpdateUser(user));
  }

  ionViewCanLeave(): boolean {
    return this.exists;
  }
}
