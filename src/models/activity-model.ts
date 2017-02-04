/*
  Activity model object - Something (weights, cardio, etc.) you can do for an exercise.
*/
export class Activity {
 
    public fitlinxxId: string;
    public image: string;     
    public name: string;    
    public type: string;

    public settings: string[];

    private DEFAULT_IMAGE = 'blank.jpg';

    constructor() {      
        this.name = '';      
        this.type = 'strength';

       this.settings = new Array<string>();        
    }

    addSetting(setting : string) {
        this.settings.push(setting);
    }    

    static fromJson(json: any) : Activity {
        let activity = new Activity();
        activity.fitlinxxId = json.fitlinxxId;         
        activity.image = json.image || activity.DEFAULT_IMAGE;          
        activity.name = json.name;    
        activity.type = json.type;  
        activity.settings = json.settings;           
        return activity;
    }     

    static fromJsonArray(jsonArray: any[]) : Activity[] {
        let activities = new Array<Activity>();
        for (let activity of jsonArray) {
            activities.push(Activity.fromJson(activity));
        }                
        return activities;
    }
}