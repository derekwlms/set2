import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { WorkoutService } from '../../providers/workout-service';

import { WorkoutPage } from '../workout/workout';

import { Notebook } from '../../models/notebook-model';
import { Workout } from '../../models/workout-model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  completedExerciseCount = 0;
  lastWorkoutDate: Date;
  pendingExerciseCount = 0;
  workoutIsFinished = false;


  notebook: Notebook;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,  
              public workoutService: WorkoutService) {
    this.notebook = this.workoutService.getNotebook();
  }

  ionViewWillEnter() {
    let currentWorkout: Workout = this.workoutService.currentWorkout;
    if (currentWorkout) {
      this.workoutIsFinished = currentWorkout.done;
      this.completedExerciseCount = currentWorkout.getExerciseCount(true);
      this.pendingExerciseCount = currentWorkout.getExerciseCount(false);
      if (this.notebook.lastUpdated && this.notebook.lastUpdated > 1) {
        this.lastWorkoutDate = new Date(this.notebook.lastUpdated);
      }      
    }
  }

  resumeWorkout() : void {
    this.navCtrl.setRoot(WorkoutPage);
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
