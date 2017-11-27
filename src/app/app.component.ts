import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Nav, Platform, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import * as fromApp from './store/app.reducers';
import * as AppActions from './store/app.actions';
import * as ChannelActions from './channel/store/channel.actions';
import * as ProfileActions from './profile/store/profile.actions';

import { ServerService } from './service/server.service';

import { WhitePage } from './home/white';
import { HomePage } from './home/home';
import { ProfilePage } from './profile/profile';
import { ChannelPage } from './channel/channel';
import { Channel } from './model/channel.model';
import { User } from './model/user.model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = WhitePage;
  user: User;
  openChannels: Channel[];
  private componentDestroyed: Subject<void> = new Subject();

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private server: ServerService,
    private store: Store<fromApp.AppState>,
    private storage: Storage) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // Listen to navigation events and update store state (useful for navigation events driven by Ionic)
      this.nav.viewDidEnter
        .takeUntil(this.componentDestroyed)
        .subscribe((viewCtrl: ViewController) => {
          if (!viewCtrl || !viewCtrl.instance) return;
          if (viewCtrl.instance instanceof HomePage) return this.store.dispatch(new AppActions.Navigated(fromApp.Page.Home));
          if (viewCtrl.instance instanceof ProfilePage) return this.store.dispatch(new AppActions.Navigated(fromApp.Page.Profile));
          if (viewCtrl.instance instanceof ChannelPage) return this.store.dispatch(new AppActions.Navigated(fromApp.Page.Channel));
        });

      this.store.select('nav')
        .takeUntil(this.componentDestroyed)
        .filter((nav: fromApp.NavState) => nav.currentPage !== nav.navTo)
        .map((nav: fromApp.NavState) => nav.navTo)
        .filter(navTo => navTo !== null)
        .subscribe((navTo: fromApp.Page) => {
          switch (navTo) {
            case fromApp.Page.Home: return this.nav.setRoot(HomePage);
            case fromApp.Page.Profile: return this.nav.push(ProfilePage);
            case fromApp.Page.Channel: return this.nav.push(ChannelPage);
          }
        });

      // observe the user state, and enforce profile screen if new user
      // TODO ngrx-store-ionic-storage does not seem to be working, it does not hydrate the store state at all
      // this.store.select('profile').take(1).subscribe((state: fromProfile.State) => {
      //   if (!state.exists) this.store.dispatch(new AppActions.NavigateTo(fromApp.Page.Profile));
      // });
      this.storage.get('Nearby-user').then(user => {
        if (!user || !user.alias) {
          // user not yet defined (in Storage at least)
          this.navigateProfile();
        } else {
          // user already set, restore it
          this.store.dispatch(new ProfileActions.RestoreUser(user));
        }
      });

      // observe the store and subscribe to changes in the Model
      this.store.select('channel')
        .takeUntil(this.componentDestroyed)
        .subscribe(channel$ => this.openChannels = channel$.openChannels);

      // observe the profile, to render user data in the Drawer
      this.store.select('profile')
        .takeUntil(this.componentDestroyed)
        .subscribe(profile$ => this.user = profile$.user);

      // mobile specific actions
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });
  }

  ngOnInit() {
    this.server.connect();
  }

  navigateProfile() {
    this.store.dispatch(new AppActions.NavigateTo(fromApp.Page.Profile));
  }

  navigateHome() {
    this.store.dispatch(new AppActions.NavigateTo(fromApp.Page.Home));
  }

  gotoChannel(channel: Channel) {
    this.store.dispatch(new ChannelActions.GotoChannel(channel));
  }

  leaveChannel(channel: Channel) {
    this.store.dispatch(new ChannelActions.LeaveChannel(channel));
  }

  ngOnDestroy() {
    // when abandoning the app, disconnect the Socket.io
    this.server.disconnect();
    // notify the other subscribers, so that they stop
    // see https://netbasal.com/when-to-unsubscribe-in-angular-d61c6b21bad3
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }
}
