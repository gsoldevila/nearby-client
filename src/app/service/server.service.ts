import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';

import { Store } from '@ngrx/store';

import { ToastService } from './toast.service';

import { AppState } from '../store/app.reducers';
import * as HomeActions from '../home/store/home.actions';
import * as ProfileActions from '../profile/store/profile.actions';
import * as ChannelActions from '../channel/store/channel.actions';

import { User } from '../model/user.model';
import { Channel } from '../model/channel.model';
import { NearbyPosition, PositionService } from './position.service';

@Injectable()
export class ServerService {
  private alreadyConnected: boolean;
  private user: User;

  constructor(private store: Store<AppState>, private socket: Socket, private positionService: PositionService, private toastService: ToastService) {
    this.alreadyConnected = false;
    this.initializeObservables();
  }

  private initializeObservables() {
    this.store.select('profile')
      .map(profile => profile.user)
      .subscribe(user => this.user = user);
  }

  connect() {
    //console.log('[ServerService] connecting to server ...');
    this.socket.connect();
    this.initSuccessHandlers();
    this.initErrorHandlers();
  }

  initSuccessHandlers() {
    this.socket.on('connect', this.connected.bind(this));
    this.socket.on('userUpdated', this.userUpdated.bind(this));
    this.socket.on('searchResponse', this.searchResponse.bind(this));
    this.socket.on('message', this.messageReceived.bind(this));
    this.socket.on('joinedChannel', this.joinedChannel.bind(this));
  }

  connected() {
    if (this.alreadyConnected) {
      // console.log('[ServerService] connection restored');
      this.store.dispatch(new ChannelActions.ConnectionRestored(this.user));

    } else {
      this.alreadyConnected = true;
    }
  }

  updateUser(user: User) {
    if (!user) return;
    //console.log('[ServerService] updating user %s', JSON.stringify(user));
    this.socket.emit('updateUser', user);
  }

  private userUpdated(response) {
    //console.log('[ServerService] user updated %s', JSON.stringify(response));
    if (response.error) {
      this.store.dispatch(new ProfileActions.UpdateUserError(response.error));
    } else {
      this.store.dispatch(new ProfileActions.UpdateUserSuccess(response.data));
    }
  }

  search(data: { position?: NearbyPosition, text?: string, range: number }) {
    // console.log('[ServerService] searching channels %s', JSON.stringify(data));
    this.socket.emit('search', data);
  }

  private searchResponse(response) {
    // console.log('[ServerService] received search results %s', JSON.stringify(response));
    if (response.error) {
      this.toastService.errorMessage(response.error.message);
    } else {
      this.store.dispatch(new HomeActions.SearchSuccess(response.data));
    }
  }

  createChannel(channelName: string) {
    if (!channelName) return;
    this.positionService.getCurrentPosition(true).then(
      (pos) => {
        const createRequest = { user: this.user, channel: channelName, position: pos };
        // console.log('[ServerService] creating channel %s', createRequest);
        this.socket.emit('joinChannel', createRequest);
      },
      (err) => {
        const createRequest = { user: this.user, channel: channelName };
        // console.log('[ServerService] creating channel %s', createRequest);
        this.socket.emit('joinChannel', createRequest);
      }
    )
  }

  enterChannel(channel: Channel) {
    if (!channel) return;
    const enterRequest = { user: this.user, channel: channel.name };
    //console.log('[ServerService] entering channel %s', JSON.stringify(enterRequest));
    this.socket.emit('joinChannel', enterRequest);
  }

  private joinedChannel(response) {
    //console.log('[ServerService] you joined channel %s', JSON.stringify(response));
    if (response.error) {
      this.store.dispatch(new ChannelActions.EnterChannelError(response.error));
    } else {
      this.store.dispatch(new ChannelActions.OpenChannel(response.data));
    }
  }

  sendMessage(channel: string, message: string) {
    if (!message || !message.trim()) return;
    let messageRequest = { user: this.user, channel: channel, message: message.trim() };
    //console.log('[ServerService] sending message %s', JSON.stringify(messageRequest));
    this.socket.emit('message', messageRequest);
  }

  private messageReceived(response) {
    //console.log('[ServerService] received message %s', JSON.stringify(response));
    if (response.error) {
      // TODO handle UI error
      console.log('Error receiving message %s', JSON.stringify(response.error));
    } else {
      this.store.dispatch(new ChannelActions.MessageReceived(response.data));
    }
  }

  leaveChannel(channel: Channel) {
    if (!channel) return;
    const leaveRequest = { user: this.user, channel: channel };
    //console.log('[ServerService] leaving channel %s', JSON.stringify(leaveRequest));
    this.socket.emit('leaveChannel', leaveRequest);
  }

  initErrorHandlers() {
    this.socket.on('disconnect', this.connectionLost.bind(this));
    this.socket.on('connect_error', (err) => this.toastService.error(err));
    this.socket.on('connect_timeout', () => this.toastService.errorMessage('Connection timeout'));
    this.socket.on('reconnect', () => this.toastService.warning('Reconnected successfully'));
    this.socket.on('reconnect_attempt', () => this.toastService.errorMessage('Connection lost. Trying to reconnect'));
    this.socket.on('reconnecting', () => this.toastService.warning('Reconnecting'));
    this.socket.on('reconnect_error', (err) => this.toastService.error(err));
    this.socket.on('reconnect_failed', () => this.toastService.errorMessage('Connection lost. Failed to reconnect'));
  }

  connectionLost() {
    //console.log('[ServerService] connection lost');
    this.store.dispatch(new ChannelActions.ConnectionLost(this.user));
  }

  disconnect() {
    //console.log('[ServerService] disconnecting from server ...');
    this.store.dispatch(new ChannelActions.ConnectionLost(this.user));
    this.socket.disconnect();
  }
}
