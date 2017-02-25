/*
  Activity Setting model object - A parameter for an exercise, such as back position or leg position.
*/
export class ActivitySetting {
    
    public name: string;    
    public value: number;

    private DEFAULT_SETTING_NAME = 'Seat';  
    private DEFAULT_SETTING = 3;          

    constructor(name: string, value: number) {  
        this.name = name || this.DEFAULT_SETTING_NAME;
        this.value = value || this.DEFAULT_SETTING;    
    }

    static fromJson(json: any) : ActivitySetting {
        return new ActivitySetting(json.name, json.value);
    }    

    static fromJsonArray(jsonArray: any[]) : ActivitySetting[] {
        let settings = new Array<ActivitySetting>();
        for (let setting of jsonArray) {
            settings.push(ActivitySetting.fromJson(setting));
        }                
        return settings;
    } 
    
}