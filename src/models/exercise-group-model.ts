import { Exercise } from './exercise-model';

/*
  ExerciseGroup model object - Groups completed exercises by a common property.
  Useful when combining multiple exercises for the same activity.
*/

export class ExerciseGroup {

    private MILLISECS_PER_SET = 60 * 1000;
      
    public durationMillisecs: number;
    public startDate: Date;

    constructor(public groupId: string) {      
        this.durationMillisecs = 0;
        this.startDate = new Date(0);
    }

    addExercise(exercise: Exercise) {
        this.durationMillisecs += 
            exercise.sets.length * this.MILLISECS_PER_SET;
    }  

    static groupCompletedExercises(exercises: Array<Exercise>, property: string): any {
        let exerciseGroups = {};
        for (let exercise of exercises) {
            if (exercise.done && !exercise.skipped && exercise[property]) {
                let group: ExerciseGroup = exerciseGroups[exercise[property]];
                if (!group) {
                    group = new ExerciseGroup(exercise[property]);
                    // TODO Update this to do the per-exercise time
                    group.startDate = new Date();
                    exerciseGroups[exercise[property]] = group;
                }
                group.addExercise(exercise);
            }
        }    
        return exerciseGroups;
    }
    
}