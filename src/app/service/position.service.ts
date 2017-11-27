import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

export class NearbyPosition {
  constructor(public latitude: number, public longitude: number, public accuracy: number, public timestamp: number) { }
}

@Injectable()
export class PositionService {
  private currentPosition: NearbyPosition;

  constructor(private toastService: ToastService) { }

  getCurrentPosition(refresh: boolean): Promise<NearbyPosition> {
    if (refresh || !this.currentPosition || this.currentPosition.timestamp + 60000 < Date.now()) {
      if (!navigator.geolocation) {
        const msg = 'The current device/browser does not support geolocation';
        this.displayErrorMessage(msg);
        return Promise.reject({ code: PositionError.POSITION_UNAVAILABLE, message: msg });
      } else {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              this.currentPosition = new NearbyPosition(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, pos.timestamp);
              resolve(this.currentPosition);
            },
            (err) => {
              this.displayError(err);
              if (reject) reject(err)
            });
        });
      }
    } else {
      return Promise.resolve(this.currentPosition);
    }
  }

  private displayError(err: PositionError) {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        return this.displayErrorMessage('Enable geolocation for a better experience');
      case err.POSITION_UNAVAILABLE:
        return this.displayErrorMessage('Current location is not available');
      case err.TIMEOUT:
        return this.displayErrorMessage('Error trying to determine current location');
    }
  }

  private displayErrorMessage(msg: string) {
    this.toastService.errorMessage(msg);
  }
}
