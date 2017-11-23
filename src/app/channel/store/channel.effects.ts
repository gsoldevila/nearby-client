import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { ServerService } from '../../service/server.service';
import { NotificationService } from '../../service/notification.service';

import * as fromApp from '../../store/app.reducers';
import * as AppActions from '../../store/app.actions';
import * as ChannelActions from './channel.actions';
import { Channel } from '../../model/channel.model';

@Injectable()
export class ChannelEffects {
  constructor(private actions$: Actions,
    private server: ServerService,
    private notificationService: NotificationService) { }

  @Effect({ dispatch: false })
  sendCreateChannelRequest = this.actions$
    .ofType(ChannelActions.TRY_CREATE_CHANNEL)
    .map((action: ChannelActions.TryCreateChannel) => action.payload)
    .do((name: string) => this.server.createChannel(name));

  @Effect({ dispatch: false })
  registerForChannel = this.actions$
    .ofType(ChannelActions.TRY_OPEN_CHANNEL)
    .map((action: ChannelActions.TryOpenChannel) => action.payload)
    .do((channel: Channel) => this.server.enterChannel(channel));

  @Effect()
  navigateToChannel = this.actions$
    .ofType(ChannelActions.OPEN_CHANNEL, ChannelActions.GOTO_CHANNEL)
    .map(() => new AppActions.NavigateTo(fromApp.Page.Channel));

  @Effect({ dispatch: false })
  sendMessageToServer = this.actions$
    .ofType(ChannelActions.SEND_MESSAGE)
    .map((action: ChannelActions.SendMessage) => action.payload)
    .do(data => this.server.sendMessage(data.channel, data.message));

  @Effect({ dispatch: false })
  notifyOnNewMEssage = this.actions$
    .ofType(ChannelActions.MESSAGE_RECEIVED)
    .map((action: ChannelActions.MessageReceived) => action.payload)
    .do(message => {
      console.log('yeaaah');
      this.notificationService.notify(message)
    });

  @Effect({ dispatch: false })
  notifyServerWhenLeavingAChannel = this.actions$
    .ofType(ChannelActions.LEAVE_CHANNEL, ChannelActions.LEAVE_CURRENT_CHANNEL)
    .map((action: ChannelActions.LeaveChannel | ChannelActions.LeaveCurrentChannel) => action.payload)
    .do((channel: Channel) => this.server.leaveChannel(channel));

  @Effect()
  goHomeWhenLeavingCurrentChannel = this.actions$
    .ofType(ChannelActions.LEAVE_CURRENT_CHANNEL, ChannelActions.CONNECTION_LOST)
    .map(() => new AppActions.NavigateTo(fromApp.Page.Home));
}
