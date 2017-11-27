import { App, AlertController, Refresher } from 'ionic-angular';
import { Component, Renderer, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/take";
import "rxjs/add/operator/do";

import { PositionService, NearbyPosition } from '../service/position.service';
import { AppState } from '../store/app.reducers';
import * as HomeActions from './store/home.actions';
import * as ChannelActions from '../channel/store/channel.actions';
import * as fromHome from './store/home.reducers';
import * as fromChannel from '../channel/store/channel.reducers';
import { Channel } from '../model/channel.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild('searchBar') searchBar;
  searchInput: Element;
  showSearch: boolean = false;
  filterRange: number = -1;
  filterText: string;

  homeState: Observable<fromHome.State>;
  channelState: Observable<fromChannel.State>;

  rangeLabels = {
    '-1': 'world-wide',
    '1': '1 Km',
    '4': '4 Km',
    '10': '10 Km',
    '50': '50 Km',
  };

  constructor(
    private positionService: PositionService,
    private alertCtrl: AlertController,
    private store: Store<AppState>,
    private renderer: Renderer,
    private _app: App) { }

  ngOnInit() {
    this.homeState = this.store.select('home');
    this.channelState = this.store.select('channel');
    this.searchInput = this.searchBar.getNativeElement().querySelector('input');
    this.renderer.listen(this.searchInput, 'blur', this.hideSearch.bind(this));
    this.doSearch();
  }

  ionViewDidEnter() {
    this._app.setTitle('Nearby');
  }

  doShowSearch(evt) {
    if (evt && evt.preventDefault) evt.preventDefault();
    this.showSearch = true;
    //delay required or ionic styling gets finicky
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.searchInput, 'focus', [])
    }, 0);
  }

  updateSearch(evt) {
    this.filterText = evt.target.value;
    this.doSearch();
  }

  clearSearch() {
    this.filterText = '';
    this.searchBar.setValue('');
    this.hideSearch();
    this.doSearch();
  }

  hideSearch() {
    this.showSearch = false;
  }

  doShowRange() {
    this.showSearch = false;
    const alert = this.alertCtrl.create({
      title: 'Range',
      inputs: Object.keys(this.rangeLabels).map(
        range => {
          return {
            name: 'range',
            type: 'radio',
            label: this.rangeLabels[range],
            value: range,
            checked: this.filterRange === +range
          }
        }),
      buttons: [{ text: 'Apply', handler: this.updateRange.bind(this) }]
    });
    alert.present();
  }

  updateRange(value: any, evt?) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    this.filterRange = +value;
    this.doSearch();
  }

  doSearch(refresher?: Refresher) {
    const search = (pos: NearbyPosition) => {
      this.store.dispatch(new HomeActions.TrySearch({
        position: pos,
        range: this.filterRange,
        text: this.filterText
      }, refresher));
    };
    const searchError = () => {
      this.store.dispatch(new HomeActions.TrySearch({
        range: this.filterRange,
        text: this.filterText
      }, refresher));
    }
    this.positionService.getCurrentPosition(typeof refresher === "object").then(search, searchError);
  }

  doCreateChannel() {
    let alert = this.alertCtrl.create({
      title: 'Create channel',
      message: 'Please enter a name',
      inputs: [{ name: 'channel', placeholder: 'Channel name', value: this.filterText }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create', handler: data => {
            this.store.dispatch(new ChannelActions.TryCreateChannel(data.channel));
          }
        }
      ]
    });
    alert.present();
  }

  openChannel(item: Channel) {
    this.showSearch = false;
    if (item.online) this.store.dispatch(new ChannelActions.GotoChannel(item));
    else this.store.dispatch(new ChannelActions.TryOpenChannel(item));
  }
}
