import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { IonicStorageModule } from '@ionic/storage';
// TODO ngrx-store-ionic-storage does not seem to be working, it does not hydrate the store state at all
//import { StorageSyncEffects } from 'ngrx-store-ionic-storage';
import { SocketIoModule } from 'ng-socket-io';
import { LinkyModule } from 'angular-linky';
import { MomentModule } from 'angular2-moment';

import { PRODUCTION, SOCKET_IO_URL } from '@environment';

import { MyApp } from './app.component';
import { WhitePage } from './home/white';
import { HomePage } from './home/home';
import { ProfilePage } from './profile/profile';
import { ChannelPage } from './channel/channel';
import { ChannelOptions } from './channel/channel.options';

import { ServerService } from './service/server.service';
import { NotificationService } from './service/notification.service';
import { PositionService } from './service/position.service';
import { ToastService } from './service/toast.service';

import { HomeEffects } from './home/store/home.effects';
import { ProfileEffects } from './profile/store/profile.effects';
import { ChannelEffects } from './channel/store/channel.effects';
import { reducers } from './store/app.reducers';

// TODO ngrx-store-ionic-storage does not seem to be working, it does not hydrate the store state at all
import { logMetaReducer/*, storageMetaReducer*/ } from './store/meta.reducers';


const metaReducers = [];
if (PRODUCTION) metaReducers.push(logMetaReducer);
// TODO ngrx-store-ionic-storage does not seem to be working, it does not hydrate the store state at all
//metaReducers.push(storageMetaReducer);

@NgModule({
  declarations: [
    MyApp,
    WhitePage,
    HomePage,
    ProfilePage,
    ChannelPage,
    ChannelOptions
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers: metaReducers }),
    // TODO ngrx-store-ionic-storage does not seem to be working, it does not hydrate the store state at all
    EffectsModule.forRoot([HomeEffects, ChannelEffects, ProfileEffects/*, StorageSyncEffects*/]),
    SocketIoModule.forRoot({ url: SOCKET_IO_URL, options: {} }),
    LinkyModule,
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WhitePage,
    HomePage,
    ProfilePage,
    ChannelPage,
    ChannelOptions
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ServerService,
    NotificationService,
    PositionService,
    ToastService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
