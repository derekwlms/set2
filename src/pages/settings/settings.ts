import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Platform } from 'ionic-angular';

import { FitbitUploadService } from '../../providers/fitbit-upload-service';
import { WorkoutService } from '../../providers/workout-service';

import { Settings } from '../../models/settings-model';

declare var window: any;

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public settings: Settings;

  public selectedSettingsView: string = 'general';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,              
              private fitbitUploadService: FitbitUploadService,
              private platform: Platform,
              private workoutService: WorkoutService) {
    this.settings = workoutService.getSettings();
  }    

  clearStorage() : void {
    this.workoutService.removeLocalNotebook();
  }      

  fitbitLogin() : void {
    if (!window || !window.cordova || !window.cordova.InAppBrowser) {
      this.showAlert('Fitbit Login Error', 'No InAppBrowser available for login');
      return;
    }
    let self = this;
    this.platform.ready().then(() => {
      this.fitbitUploadService.login(window, this.settings).then(authCode => {
        self.settings.fitbitAuthorizationCode = authCode;
        self.showAlert('Fitbit login complete', 'Received authorization code: ' + authCode);
      }, (error) => {
        self.showAlert('Fitbit login error', error);
      })
    });
  }    

  private showAlert(title: string, message: string) : void {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [ 'OK' ]
    });
    alert.present();   
  }

}
