/*
  Activity Setting model object - A parameter for an exercise, such as back position or leg position.
*/
export class ExerciseSetting {
    
    public name: string;    
    public value: number;

    constructor(name: string, value: number) {  
        this.name = name;
        this.value = value;    
    }

    static fromJson(json: any) : ExerciseSetting {
        return new ExerciseSetting(json.name, json.value);
    }     
    
}