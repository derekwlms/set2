import { Exercise } from './exercise-model';

/*
  Workout model object - Records a group of Exercises done at once (e.g., one gym visit).
*/
export class Workout {

    public done: boolean;  
    public note: string;
    public title: string;

    public completedMsecs: number;
    public fitBitUploadMsecs: number;
    public fitLinxxUploadMsecs: number;
    public startedMsecs: number;

    public exercises?: Exercise[];   

    constructor() {
        this.done = false;        
        this.note = '';        
        this.title = '';

        this.exercises = new Array<Exercise>();
    }

    addExercise(exercise : Exercise) {
        this.exercises.push(exercise);
    }

    isInProgress() : boolean {
        for (let exercise of this.exercises) {
            if (exercise.done) {
                return true;
            }
        }
        return false;
    }

    removeExercise(exercise : Exercise) {
        let idx = this.exercises.indexOf(exercise, 0);
        if (idx > -1) {
            this.exercises.splice(idx, 1)
        }
    }

    static fromJson(json: any) : Workout {
        let workout = new Workout();
        workout.done = json.done;
        workout.note = json.note || '';
        workout.title = json.title || '';

        workout.completedMsecs = json.completedMsecs;
        workout.fitBitUploadMsecs = json.fitBitUploadMsecs;
        workout.fitLinxxUploadMsecs = json.fitLinxxUploadMsecs;
        workout.startedMsecs = json.startedMsecs;
        
        for (let exercise of json.exercises) {
            workout.addExercise(Exercise.fromJson(exercise));
        }
        return workout;
    }    
    
}