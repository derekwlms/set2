import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WorkoutService } from '../../providers/workout-service';

import { WorkoutSummary } from '../../models/workout-summary-model';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  workoutSummaries = new Array<WorkoutSummary>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,  
              public workoutService: WorkoutService) {             
  }    

  ionViewWillEnter() {
    this.workoutSummaries = this.getWorkoutSummaries();  
  }  

  getWorkoutSummaries() : Array<WorkoutSummary> {
    return this.workoutService.getNotebook().workouts
      .slice()
      .reverse()
      .filter(workout => {
        return workout.completedMsecs;
      })
      .map(workout => {
        return new WorkoutSummary(workout);
      });
  }          

}
