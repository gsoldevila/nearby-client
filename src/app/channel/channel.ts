import { PopoverController, Content, App } from 'ionic-angular';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import * as fromApp from '../store/app.reducers';
import * as fromChannel from './store/channel.reducers';
import * as ChannelActions from './store/channel.actions';
import { ChannelOptions } from './channel.options';
import { Channel } from '../model/channel.model';
import { User } from '../model/user.model';

@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html'
})
export class ChannelPage implements OnDestroy {
  @ViewChild(Content) content: Content;
  myself: User;
  channel: Channel;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<fromApp.AppState>,
    private popoverCtrl: PopoverController,
    private _app: App) {
    // get the current user
    this.store.select('profile')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(profile => this.myself = profile.user);

    // get the current channel
    this.store.select('channel')
      .takeUntil(this.ngUnsubscribe)
      .map((channelState: fromChannel.State) => channelState.currentChannel)
      .filter(ch => ch !== null)
      .subscribe((ch) => {
        this.channel = ch;
        this.scrollDown();
      });
  }
  ionViewDidUp
  ionViewDidEnter() {
    this._app.setTitle('Nearby' + (this.channel ? ' - #' + this.channel.name : ''));
    this.scrollDown(0);
  }

  private scrollDown(duration?: number) {
    setTimeout(() => {
      if (this.content) {
        //let dimensions = this.content.getContentDimensions();
        //this.content.scrollTo(0, dimensions.scrollHeight + 100, 100);
        //this.content.resize();
        this.content.scrollToBottom(duration);
      }
    }, 0);
  }

  sendMessage(userMessage) {
    //this.server.sendMessage(this.channel.name, userMessage.value);
    this.store.dispatch(new ChannelActions.SendMessage({ channel: this.channel.name, message: userMessage.value }));
    userMessage.value = '';
  }

  channelOptions(ev) {
    this.popoverCtrl.create(ChannelOptions, { channel: this.channel }).present({ ev: ev });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
