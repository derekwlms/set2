import { Settings } from './settings-model';
import { Workout } from './workout-model';

/*
  Notebook model object - A workout notebook containing a history of all workouts.
*/
export class Notebook {

    public id: string;
    public lastUpdated: number;    

    public settings: Settings;

    public workouts: Workout[];   

    private static _lastId: number = 0;

    constructor() {      
        this.id = 'notebook-' + Notebook._lastId++;
        this.lastUpdated = 1;            
        this.settings = new Settings();
        this.workouts = new Array<Workout>();
    }

    addWorkout(workout : Workout) {
        this.workouts.push(workout);
    }

    /*
     * If the given notebook is more current than me,
     * update my data from it.
     * Return true if I updated my notebook
     */
    updateNotebook(notebook: Notebook) {
        if (notebook.lastUpdated && notebook.lastUpdated > this.lastUpdated) {
            this.id = notebook.id;
            this.lastUpdated = notebook.lastUpdated; // parseInt('' + notebook.lastUpdated);   
            this.settings = Settings.fromJson(notebook.settings);
            this.workouts = notebook.workouts;
            return true;
        } else {
            return false;
        }
    }

    static fromJson(json: any) : Notebook {
        let notebook = new Notebook();
        notebook.id = json.id || notebook.id;
        notebook.lastUpdated = json.lastUpdated || 1;          
        notebook.settings = Settings.fromJson(json.settings);      
        for (let workout of json.workouts) {
            notebook.addWorkout(Workout.fromJson(workout));
        }
        return notebook;
    }
}