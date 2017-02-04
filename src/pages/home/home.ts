import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

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
              public workoutService: WorkoutService) {
    this.notebook = this.workoutService.getNotebook();
  }

  ionViewDidLoad() {
    if (this.notebook.lastUpdated && this.notebook.lastUpdated > 1) {
      this.lastWorkoutDate = new Date(this.notebook.lastUpdated);
    }
  }  

  startWorkout() {
    this.workoutService.startNewWorkout();
    this.navCtrl.setRoot(WorkoutPage);
  }  

}
