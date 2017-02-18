import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { WorkoutService } from '../../providers/workout-service';

import { WorkoutPage } from '../workout/workout';

import { Notebook } from '../../models/notebook-model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  lastWorkoutDate: Date;
  notebook: Notebook;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,  
              public workoutService: WorkoutService) {
    this.notebook = this.workoutService.getNotebook();
  }

  ionViewDidLoad() {
    if (this.notebook.lastUpdated && this.notebook.lastUpdated > 1) {
      this.lastWorkoutDate = new Date(this.notebook.lastUpdated);
    }
  }  

  startWorkout() : void {
    if (this.workoutService.isWorkoutInProgress()) {
      let confirm = this.alertCtrl.create({
        title: 'Start New Workout',
        message: 'A workout is already in progress. Do you want to abandon it and start a new one?',
        buttons: [ 
          { text: 'No' }, 
          { text: 'Yes',
            handler: () => {
              this.startNewWorkout(); 
            } } ]
      });
      confirm.present();       
    } else {
      this.startNewWorkout();
    }
  }  

  private startNewWorkout() : void {
    this.workoutService.startNewWorkout();
    this.navCtrl.setRoot(WorkoutPage);
  }

}
