import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Exercise } from '../../models/exercise-model';

@Component({
  selector: 'page-exercise',
  templateUrl: 'exercise.html'
})
export class ExercisePage {

  exercise: Exercise;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.exercise = navParams.get('exercise');
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
    exercise.addSettingValue('new', 70);
  }

  addSet(exercise: Exercise) {
    exercise.addSetValue(150, 12);
  }

  cancel() {
    this.navCtrl.pop();    
  }

}
