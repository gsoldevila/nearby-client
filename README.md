## Nearby client
Nearby allows creating spontaneous, ephemeral conversation channels, based on user location. The `nearby client` component holds the client-side logic, and works in conjunction with [nearby server](https://github.com/ionic-team/ionic2-app-base).

### Features
- Conversation channels are geolocalized and open (no access control).
- **Thus, the application allows searching for conversation channels *nearby*.**
- Conversation channels are ephemeral, i.e. when the last user leaves a channel, the channel disappears.
- When disconnecting from the server (e.g. client application stops running), users will automatically leave their open conversations.

### Technologies
- The UI is currently based on [Ionic 4.x](https://ionicframework.com/) and [Angular 5.x](https://angular.io/).
- [Socket.io](https://socket.io/) for the client - server communication.
- Angular Redux store, aka [NgRxStore](https://github.com/ngrx/store), to manage the UI state.
- 3rd party components such as [angular-linky](https://github.com/dzonatan/angular-linky) or [angular2-moment](https://github.com/urish/angular2-moment).


### Installation
In order to run *Nearby* please install the [nearby server](https://github.com/ionic-team/ionic2-app-base) first. Then, clone this repository and run:
```bash
$ sudo npm install -g ionic cordova
$ npm install
$ ionic serve
```

### Useful commands
To launch Karma-Jasmine tests, please run:
```bash
$ npm test
```

Also, you can create a production build (minified, uglifyed, aot, ...) by running:
```bash
$ ionic build --prod --release
```
Upon successful build, the generated files will be available on the `www` folder.


### Roadmap
- Implement push notifications.
- Improve conversation window layout on iOS - safari.
- Add splash screen.
- Add *unread* badges on the main screen.
- Colorize conversation nicknames (IRC style).
- Implement channel information, add user count.
- Improve Unit test coverage.
- Add e2e protractor tests.
- Hide system notifications from *unread* count.
- Notifications for newly created nearby channels.
- Add Android + IOS platforms in Cordova + build native apps.
- Enrich chat capabilities: smileys, images, etc.
- Re-open previously open conversations upon user re-connection.
