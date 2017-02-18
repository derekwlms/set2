import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { Exercise } from '../../models/exercise-model';
import { Workout } from '../../models/workout-model';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {

  exercise: Exercise;
  workout: Workout;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController) {
    this.exercise = navParams.get('exercise');
    this.workout = navParams.get('workout');
  }  

  deleteExercise(exercise) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Exercise',
      message: 'Remove ' + exercise.activityName + ' from this and future workouts?',
      buttons: [ 
        { text: 'No' }, 
        { text: 'Yes',
          handler: () => {
            this.workout.removeExercise(exercise);            
            this.navCtrl.pop(); 
          } } ]
    });
    confirm.present();  
  }

  markDone(exercise) {
    exercise.done = true;
    this.navCtrl.pop();    
  }

  markSkipped(exercise) {
    exercise.skipped = true;
    exercise.done = true;
    this.navCtrl.pop();    
  }

  addSetting(exercise: Exercise) {
    exercise.addSettingValue('Seat', 3);
  }

  addSet(exercise: Exercise) {
    exercise.addSetValue(150, 12);
  }

  cancel() {
    this.navCtrl.pop();    
  }

}
