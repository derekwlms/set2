import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { WorkoutRetrievalService } from './workout-retrieval-service';
import { WorkoutUploadService } from './workout-upload-service';

import { Notebook } from '../models/notebook-model';
import { Settings } from '../models/settings-model';
import { Workout } from '../models/workout-model';

/*
  WorkoutService provider - Stores and retrieves workout data (Notebook) to/from local storage.
*/
@Injectable()
export class WorkoutService {

  private NOTEBOOK_LOCAL_STORAGE_KEY = 'notebook';

  currentWorkout: Workout;
  notebook: Notebook;  

  constructor(public storage: Storage,
              public workoutRetrievalService: WorkoutRetrievalService,
              public workoutUploadService: WorkoutUploadService) {
    this.notebook = new Notebook();
  }

  finishWorkout() : void {
    let  workout = this.getCurrentWorkout();
    workout.done = true;
    workout.completedMsecs = this.getCurrentMillisecs();
    this.notebook.addWorkout(workout);
    this.saveNotebook();
    this.workoutUploadService.uploadWorkout(this.notebook, workout);
  }

  getCurrentWorkout() : Workout {
    if (!this.currentWorkout) {
      this.startNewWorkout();
    }
    return this.currentWorkout;
  }

  getNotebook() : Notebook {
    return this.notebook;
  }

  getSettings() : Settings {
    return this.notebook.settings;
  }

  isWorkoutInProgress() : boolean {
    return this.currentWorkout && this.currentWorkout.isInProgress();
  }

  loadNotebook() : void {
    this.storage.get(this.NOTEBOOK_LOCAL_STORAGE_KEY).then((localStorageNotebook) => {
      let gotLocalStorageNotebook = false;
      if (localStorageNotebook) {
        gotLocalStorageNotebook = this.notebook.updateNotebook(localStorageNotebook);        
      }
      if (!gotLocalStorageNotebook) {
        let self = this;
        this.workoutRetrievalService.fetchNotebook(function(onlineNotebook) {
          self.notebook.updateNotebook(onlineNotebook);
        });
      }
    });
  }  

  removeLocalNotebook() : void {
    this.storage.set(this.NOTEBOOK_LOCAL_STORAGE_KEY, null);
  }

  startNewWorkout() : void {
    let nb = this.getNotebook();
    let workoutToCopy = nb && nb.workouts[0] ? nb.workouts[nb.workouts.length - 1] : new Workout();
    this.currentWorkout = Workout.fromJson(workoutToCopy);
    this.currentWorkout.startedMsecs = this.getCurrentMillisecs();
    for (let exercise of this.currentWorkout.exercises) {
        exercise.done = false;
        exercise.skipped = false;
    }   
    this.workoutUploadService.prepareNewWorkout();
  }

  private saveNotebook() {
    this.notebook.lastUpdated = this.getCurrentMillisecs();
    return this.storage.set(this.NOTEBOOK_LOCAL_STORAGE_KEY, this.notebook);
  }

  private getCurrentMillisecs(): number {
    return new Date().getTime();
  }

}
