/*
  ExerciseSet model object - Records a set within an exercise activity.
*/

export class ExerciseSet {
      
    public reps: number;
    public seconds: number;
    public weight: number;

    constructor() {      
    }

    static strengthSet(weight, reps) {
        let set = new ExerciseSet();
        set.weight = weight;
        set.reps = reps;
        return set;
    }

    static fromJson(json: any) : ExerciseSet {
        let set = new ExerciseSet();
        set.reps = json.reps;    
        set.seconds = json.seconds;             
        set.weight = json.weight;
        return set;
    }    
    
}