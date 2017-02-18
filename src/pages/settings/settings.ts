import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WorkoutService } from '../../providers/workout-service';

import { Settings } from '../../models/settings-model';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public settings: Settings;

  public selectedSettingsView: string = 'general';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public workoutService: WorkoutService) {
    this.settings = workoutService.getSettings();
  }    

  clearStorage() {
    this.workoutService.removeLocalNotebook();
  }          

}
