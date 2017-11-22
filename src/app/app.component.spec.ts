import { Type, DebugElement } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { StoreModule, Store, Action } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { MomentModule } from 'angular2-moment';

import { EffectsModule } from '@ngrx/effects';
import { HomeEffects } from './home/store/home.effects';
import { ProfileEffects } from './profile/store/profile.effects';
import { ChannelEffects } from './channel/store/channel.effects';

import { IonicModule, Platform, IonicApp, ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ServerService } from './service/server.service';
import { ToastService } from './service/toast.service';
import { PositionService } from './service/position.service';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../test-config/ionic.mocks';
import { ServerServiceMock } from './service/mock/server.service.mock';
import { PositionServiceMock } from './service/mock/position.service.mock';
import { ToastServiceMock } from './service/mock/toast.service.mock';

import { reducers } from './store/app.reducers';
import { simpleLogMetaReducer } from './store/meta.reducers';
import * as fromRoot from './store/app.reducers';
import * as AppActions from './store/app.actions';
import * as ChannelActions from './channel/store/channel.actions';
import * as ProfileActions from './profile/store/profile.actions';

import { MyApp } from './app.component';
import { WhitePage } from './home/white';
import { HomePage } from './home/home';
import { ProfilePage } from './profile/profile';

import { Channel } from './model/channel.model';
import { User } from './model/user.model';

describe('Nearby component', () => {
  let fixture: ComponentFixture<MyApp>;
  let component: MyApp;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp, WhitePage, ProfilePage, HomePage],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        StoreModule.forRoot(reducers/*, { 'metaReducers': [simpleLogMetaReducer] }*/),
        EffectsModule.forRoot([HomeEffects, ChannelEffects, ProfileEffects]),
        MomentModule
      ],
      providers: [
        { provide: ServerService, useClass: ServerServiceMock },
        { provide: PositionService, useClass: PositionServiceMock },
        { provide: ToastService, useClass: ToastServiceMock },
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        bootstrap: [IonicApp],
        entryComponents: [MyApp, WhitePage, ProfilePage, HomePage]
      }
    });
    // TestBed.compileComponents();
  }));

  describe('with no user', () => {
    let splash: SplashScreen;
    let status: StatusBar;
    let store: Store<fromRoot.AppState>;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MyApp);
      component = fixture.componentInstance;
      splash = TestBed.get(SplashScreen);
      status = TestBed.get(StatusBar);
      store = TestBed.get(Store);
      spyOn(store, 'dispatch').and.callThrough();
      spyOn(splash, 'hide').and.callThrough();
      spyOn(status, 'styleDefault').and.callThrough();
      spyOn(component.nav, 'push').and.callThrough();
      // TODO why does Ionic not trigger 'ready' himself in test environment?
      TestBed.get(Platform).ready(); // emulate Ionic behavior
    }));

    it('should be created', () => {
      expect(component instanceof MyApp).toBe(true);
    });

    it('should have an IonMenu (left sliding panel)', () => {
      de = fixture.debugElement.query(By.css('ion-menu'));
      expect(de).not.toBeNull();
    });

    it('should have an IonNav (main application placeholder)', () => {
      de = fixture.debugElement.query(By.css('ion-nav'));
      expect(de).not.toBeNull();
    });

    it('should have an initial white page', () => {
      expect(component.rootPage).toEqual(WhitePage);
    });

    it('should observe the list of open channels', () => {
      // simulate 'open channel' occurred
      let ch = new Channel('test', Date.now(), null);
      let action = new ChannelActions.OpenChannel(ch);
      store.dispatch(action);
      expect(component.openChannels).toContain(ch);
    });

    it('should hide splash screen and style status bar', () => {
      expect(splash.hide).toHaveBeenCalled();
      expect(status.styleDefault).toHaveBeenCalled();
    });

    it('should trigger navigation to Profile page', () => {
      let navTo = new AppActions.NavigateTo(fromRoot.Page.Profile);
      expect(store.dispatch).toHaveBeenCalledWith(navTo);
    });

    it('should handle navigation, for example to Profile page', () => {
      expect(component.nav.push).toHaveBeenCalledWith(ProfilePage);
    });

    it('should observe Ionic-driven navigation and update the store', () => {
      // TODO why does Ionic not trigger 'viewDidEnter' himself in test environment?
      let view = new ViewController();
      view.instance = new ProfilePage(store, null);
      component.nav.viewDidEnter.next(view); // emulate Ionic behavior

      // check the component triggers the store action
      let action = new AppActions.Navigated(fromRoot.Page.Profile)
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should allow triggering home navigation store action', () => {
      component.navigateHome();
      let navTo = new AppActions.NavigateTo(fromRoot.Page.Home);
      expect(store.dispatch).toHaveBeenCalledWith(navTo);
    });

    it('should allow triggering navigation to an open channel', () => {
      let ch = new Channel('test', Date.now(), null);
      component.gotoChannel(ch);
      let navTo = new ChannelActions.GotoChannel(ch);
      expect(store.dispatch).toHaveBeenCalledWith(navTo);
    });

    it('should allow triggering closing an open channel', () => {
      let ch = new Channel('test', Date.now(), null);
      component.leaveChannel(ch);
      let navTo = new ChannelActions.LeaveChannel(ch);
      expect(store.dispatch).toHaveBeenCalledWith(navTo);
    });
  });

  describe('with some user', () => {
    let user: User = new User(-1, 'test');
    let server: ServerService;
    let store: Store<fromRoot.AppState>;

    beforeEach(() => {
      let storage = TestBed.get(Storage);
      spyOn(storage, 'get').and.callFake((arg) => {
        return arg === 'Nearby-user' ?
          Promise.resolve(user) :
          Promise.reject('unmocked');
      });
    });

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MyApp);
      component = fixture.componentInstance;
      server = TestBed.get(ServerService);
      store = TestBed.get(Store);
      spyOn(component.nav, 'setRoot').and.callThrough();
      spyOn(server, 'connect').and.callThrough();
      spyOn(server, 'disconnect').and.callThrough();
      spyOn(store, 'dispatch').and.callThrough();
      // TODO why does Ionic not trigger 'ready' himself in test environment?
      TestBed.get(Platform).ready(); // emulate Ionic behavior
    }));

    it('should restore user and navigate home', () => {
      fixture.detectChanges(); // triggers ngOnInit()
      let restore = new ProfileActions.RestoreUser(user);
      expect(store.dispatch).toHaveBeenCalledWith(restore);
      expect(component.nav.setRoot).toHaveBeenCalledWith(HomePage);
    });

    it('should call server connect / disconnect methods when loading / unloading', () => {
      fixture.detectChanges(); // triggers ngOnInit()
      expect(server.connect).toHaveBeenCalled();
      component.ngOnDestroy();
      expect(server.disconnect).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    //store
  });
});
