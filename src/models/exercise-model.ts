import { Activity } from './activity-model';
import { ExerciseSet } from './exercise-set-model';
import { ExerciseSetting } from './exercise-setting-model';

/*
  Exercise model object - Records an instance of an exercise activity within a Workout.
*/
export class Exercise {
 
    public activityName: string; 
    public done: boolean;  
    public fitlinxxId: string;
    public image: string;    
    public note: string;    
    public skipped: boolean;

    public sets: ExerciseSet[];
    public settings: ExerciseSetting[];   // back, chest, front, legs, range, seat

    private DEFAULT_SETTING = 3; 
    private DEFAULT_IMAGE = 'blank.jpg';      

    constructor() {
        this.activityName = ''; 
        this.fitlinxxId = '';       
        this.done = false;              
        this.note = '';     
        this.skipped = false;   

        this.sets = new Array<ExerciseSet>();  
        this.settings = new Array<ExerciseSetting>();               
    }

    addSet(set: ExerciseSet) {
        this.sets.push(set);
    }    

    addSetValue(weight: number, reps: number) {
        this.addSet(ExerciseSet.strengthSet(weight, reps));
    }

    addSetting(setting: ExerciseSetting) {
        this.settings.push(setting);
    }   

    addSettingValue(name: string, value: number) {
        this.addSetting(new ExerciseSetting(name, value));
    }

    static fromActivity(activity: Activity) : Exercise {
        let exercise = new Exercise();
        exercise.activityName = activity.name || '';  
        exercise.fitlinxxId = activity.fitlinxxId || ''; 
        exercise.image = activity.image || exercise.DEFAULT_IMAGE;      
        // exercise.type = activity.type;  
        // TODO Add default setting to Activity    
        for (let settingName of activity.settings) {
            exercise.addSettingValue(settingName, exercise.DEFAULT_SETTING);
        }
        return exercise;
    }  

    static fromJson(json: any) : Exercise {
        let exercise = new Exercise();
        exercise.activityName = json.activityName || '';
        exercise.done = json.done;
        exercise.fitlinxxId = json.fitlinxxId || '';
        exercise.image = json.image || exercise.DEFAULT_IMAGE;
        exercise.note = json.note || '';
        exercise.skipped = json.skipped;
        for (let set of json.sets) {
            exercise.addSet(ExerciseSet.fromJson(set));
        }
        for (let setting of json.settings) {
            exercise.addSetting(ExerciseSetting.fromJson(setting));
        }        
        return exercise;
    }      
    
}