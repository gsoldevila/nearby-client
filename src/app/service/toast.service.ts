import { ToastController, Toast } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastService {
  private toast: Toast;

  constructor(private toastCtrl: ToastController) { }

  warning(message: string) {
    this.createUpdateToast(message, false, 3000);
  }

  errorMessage(message: string) {
    this.createUpdateToast(message, true);
  }

  error(err: Error) {
    this.errorMessage(err.name + '. ' + err.message);
  }



  private createUpdateToast(message: string, showCloseButton: boolean, duration?: number) {
    if (this.toast) {
      this.toast.setMessage(message);
      this.toast.setShowCloseButton(showCloseButton);
      this.toast.setDuration(duration);
    } else {
      this.toast = this.toastCtrl.create({ message: message, showCloseButton: showCloseButton, duration: duration });
      this.toast.onDidDismiss(() => this.toast = null); // delete reference
      this.toast.present();
    }
  }
}
