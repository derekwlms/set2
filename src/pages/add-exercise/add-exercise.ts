import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { ActivityService } from '../../providers/activity-service';

import { Activity } from '../../models/activity-model';
import { Exercise } from '../../models/exercise-model';
import { Workout } from '../../models/workout-model';

/*
  AddExercise page - adds an exercise to a workout.
*/
@Component({
  selector: 'page-add-exercise',
  templateUrl: 'add-exercise.html'
})
export class AddExercisePage {

  activities: Activity[];
  workout: Workout;

  constructor(public viewCtrl: ViewController, 
              public navParams: NavParams,
              public activityService : ActivityService) {
    this.activities = new Array<Activity>();
  }

  ionViewDidLoad() {
    this.activities = this.activityService.activities;
    this.workout = this.navParams.get('workout');   
    console.log('add exercise', this);     
  }

  selectActivity(activity) {
    console.log('add exercise - selected activity', activity); 
    if (activity) {
      this.workout.addExercise(Exercise.fromActivity(activity));
    }
    this.viewCtrl.dismiss({});    
  }    

  cancel() {
    this.viewCtrl.dismiss({});    
  }  

}
