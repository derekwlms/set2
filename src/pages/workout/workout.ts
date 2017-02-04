import { Component } from '@angular/core';

import { AlertController, ModalController, NavController, NavParams } from 'ionic-angular';

import { Exercise } from '../../models/exercise-model';
import { Workout } from '../../models/workout-model';
import { WorkoutService } from '../../providers/workout-service';

import { AddExercisePage } from '../add-exercise/add-exercise';
import { ExercisePage } from '../exercise/exercise';
import { UploadPage } from '../upload/upload';

@Component({
  selector: 'page-workout',
  templateUrl: 'workout.html'
})

export class WorkoutPage {
  workout: Workout;

  public workoutFilter: string = 'pending';

  constructor(
    public alertCtrl: AlertController,    
    public modalCtrl: ModalController,
    public navCtrl: NavController,     
    public navParams: NavParams,
    public workoutService: WorkoutService) {

    this.workout = workoutService.getCurrentWorkout();
  }

  getFilteredExercises() {
    return this.workout.exercises.filter(exercise => {
      switch (this.workoutFilter) {
        case 'done': return exercise.done && !exercise.skipped;
        case 'pending': return !exercise.done;
        case 'skipped': return exercise.skipped;
        default: return true;
    }});
  }

  addExercise() {
    let addExerciseModal = this.modalCtrl.create(
            AddExercisePage, { "workout": this.workout });
    addExerciseModal.present();
  }

  finishWorkout() {
    let confirm = this.alertCtrl.create({
      title: 'Finish Workout',
      message: 'End this workout and upload results?',
      buttons: [ 
        { text: 'Cancel' }, 
        { text: 'OK',
          handler: () => {
            console.log('finish workout');
            this.navCtrl.setRoot(UploadPage);            
            this.workoutService.finishWorkout();
          } } ]
    });
    confirm.present();
  }  

  exerciseTapped(event, exercise) {
    this.navCtrl.push(ExercisePage, {
      exercise: exercise
    });
  }

  markDone(exercise : Exercise) {
    exercise.done = true;
  }  

  markSkipped(exercise : Exercise) {
    exercise.skipped = true;
    exercise.done = true;
  }   
}
