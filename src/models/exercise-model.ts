import { Activity } from './activity-model';
import { ActivitySetting } from './activity-setting-model';
import { ExerciseSet } from './exercise-set-model';

/*
  Exercise model object - Records an instance of an exercise activity within a Workout.
*/
export class Exercise {
 
    public activityName: string; 
    public done: boolean;  
    public fitbitId: string;
    public fitlinxxId: string;
    public image: string;    
    public note: string;    
    public skipped: boolean;

    public sets: ExerciseSet[];
    public settings: ActivitySetting[];   // back, chest, front, legs, range, seat

    private DEFAULT_FITBIT_ID = '2050';   // Weights
    private DEFAULT_IMAGE = 'blank.jpg';         

    constructor() {
        this.activityName = ''; 
        this.fitbitId = '';        
        this.fitlinxxId = '';       
        this.done = false;              
        this.note = '';     
        this.skipped = false;   

        this.sets = new Array<ExerciseSet>();  
        this.settings = new Array<ActivitySetting>();               
    }

    addSet(set: ExerciseSet) {
        this.sets.push(set);
    }    

    addSetValue(weight: number, reps: number) {
        this.addSet(ExerciseSet.strengthSet(weight, reps));
    }

    getExerciseSet(index: number) : ExerciseSet {
        return this.sets[index] ? this.sets[index] :  ExerciseSet.strengthSet(0, 0);
    }

    addSetting(setting: ActivitySetting) {
        this.settings.push(setting);
    }   

    addSettingValue(name: string, value: number) {
        this.addSetting(new ActivitySetting(name, value));
    }

    static fromActivity(activity: Activity) : Exercise {
        let exercise = new Exercise();
        exercise.activityName = activity.name || '';  
        exercise.fitbitId = activity.fitbitId || exercise.DEFAULT_FITBIT_ID;         
        exercise.fitlinxxId = activity.fitlinxxId || ''; 
        exercise.image = activity.image || exercise.DEFAULT_IMAGE;      
        // exercise.type = activity.type;  
        for (let setting of activity.settings) {
            exercise.addSetting(setting);
        }
        return exercise;
    }  

    static fromJson(json: any) : Exercise {
        let exercise = new Exercise();
        exercise.activityName = json.activityName || '';
        exercise.done = json.done;
        exercise.fitbitId = json.fitbitId || '';        
        exercise.fitlinxxId = json.fitlinxxId || '';
        exercise.image = json.image || exercise.DEFAULT_IMAGE;
        exercise.note = json.note || '';
        exercise.skipped = json.skipped;
        for (let set of json.sets) {
            exercise.addSet(ExerciseSet.fromJson(set));
        }
        for (let setting of json.settings) {
            exercise.addSetting(ActivitySetting.fromJson(setting));
        }        
        return exercise;
    }      
    
}