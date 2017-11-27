import { Component } from "@angular/core";
import { ViewController, NavParams } from "ionic-angular";
import { Store } from "@ngrx/store";

import * as fromApp from '../store/app.reducers';
import * as ChannelActions from './store/channel.actions';

@Component({
  template: `
    <ion-list no-lines>
      <button ion-item (tap)="currentChannelInfo()">Channel info</button>
      <button ion-item (tap)="currentChannelLeave()">Leave channel</button>
    </ion-list>
  `,
  styles: ['.list-md { margin-bottom: 0 }']
})
export class ChannelOptions {

  constructor(public viewCtrl: ViewController,
    private store: Store<fromApp.AppState>,
    private params: NavParams) { }

  currentChannelInfo() {
    // TODO
    this.viewCtrl.dismiss();
  }

  currentChannelLeave() {
    this.store.dispatch(new ChannelActions.LeaveCurrentChannel(this.params.get('channel')));
    this.viewCtrl.dismiss();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
