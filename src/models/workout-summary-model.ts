import { Workout } from './workout-model';

/*
  WorkoutSummary model object - Summarizes a workout for display on the history page.
*/
export class WorkoutSummary {

    public note: string;
    public title: string;

    public completedDate: Date;
    public completedExerciseCount = 0;
    public elapsedMinutes = '';
    public uploads = '';  

    constructor(workout: Workout) {     
        this.note = workout.note;        
        this.title = workout.title || 'Workout';

        if (workout.completedMsecs) {
            this.completedDate = new Date(workout.completedMsecs);
            if (workout.startedMsecs) {
                this.elapsedMinutes = ((workout.completedMsecs - workout.startedMsecs) / (60 * 1000))
                                        .toFixed(2);
            }
        }
        // TODO upload timestamps aren't saved with the notebook - 
        // the async uploads finish long after saveNotebook()
        if (workout.emailUploadMsecs) {
            this.uploads += ' Email';
        }        
        if (workout.fitBitUploadMsecs) {
            this.uploads += ' Fitbit';
        }      
        if (workout.fitLinxxUploadMsecs) {
            this.uploads += ' FitLinxx';
        }    
        this.completedExerciseCount = workout.exercises.filter(exercise => {
            return exercise.done && !exercise.skipped;
        }).length;
    }   
    
}