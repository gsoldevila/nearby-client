import { Injectable } from '@angular/core';
import { Message } from '../model/message.model';

import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { User } from "../model/user.model";

const PROMPT_INTERVAL = 300000; // 5 minutes
// TODO Notification type definition is wrong
declare var Notification: any;

@Injectable()
export class NotificationService {
  private user: User;
  private askedTimestamp: number = 0;

  constructor(private store: Store<AppState>) {
    this.initializeObservables();
  }

  private initializeObservables() {
    this.store.select('profile')
      .map(profile => profile.user)
      .subscribe(user => this.user = user);
  }

  private isAllowed(): Promise<string> {
    if (Notification && Notification.permission) {
      // browser does support Notifications
      if (Notification.permission === 'granted') {
        return Promise.resolve(Notification.permission);
      } else if (Notification.permission === 'default' && this.canAskAgain()) {
        this.askedTimestamp = Date.now();
        return Notification.requestPermission();
      }
    }

    // browser does not support Notifications
    return Promise.resolve('denied');
  }

  notify(msg: Message) {
    if (!msg.author || !msg.author.alias) return;
    if (msg.author.alias === this.user.alias) return;
    this.isAllowed().then(permission => this._notify(permission, msg));
  }

  private _notify(permission: string, msg: Message) {
    if (permission !== 'granted') return;
    let author = msg.author.alias || 'somebody';
    new Notification(author, {
      'badge': '/assets/icon/favicon.ico',
      'icon': '/assets/icon/favicon.ico',
      'tag': 'nearby-message',
      'body': msg.content,
      'requireInteraction': true
    });
  }

  private canAskAgain(): boolean {
    // check if it's been more than 5 minutes since we asked for permission
    return Date.now() - this.askedTimestamp > PROMPT_INTERVAL;
  }
}
