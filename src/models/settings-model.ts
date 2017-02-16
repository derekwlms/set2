/*
  Settings model object - Holds user settings and preferences.
*/
export class Settings {

    public emailAddress: string;
    public emailApiKey: string;
    public emailDomain: string;
    public fitbitAuthorizationCode: string;  
    public fitbitClientId: string;    
    public fitbitClientSecret: string;    
    public fitbitRedirectUri: string;       
    public fitLinxxPassword: string;
    public fitLinxxUserId: string;
    public name: string;

    // Only for FitLinxx:
    public bodyWeight: number;    

    static fromJson(json: any) : Settings {
        let settings = new Settings();
        settings.bodyWeight = json.bodyWeight;
        settings.emailAddress = json.emailAddress;
        settings.emailApiKey = json.emailApiKey;
        settings.emailDomain = json.emailDomain;
        settings.fitbitAuthorizationCode = json.fitbitAuthorizationCode; 
        settings.fitbitClientId = json.fitbitClientId;        
        settings.fitbitClientSecret = json.fitbitClientSecret;  
        settings.fitbitRedirectUri = json.fitbitRedirectUri;                        
        settings.fitLinxxPassword = json.fitLinxxPassword;        
        settings.fitLinxxUserId = json.fitLinxxUserId;
        settings.name = json.name;
        return settings;
    }
}