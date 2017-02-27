/*
  FitbitAuthorization model object - Tracks state of Fitbit OAuth 2 authZ.
*/

export class FitbitAuthorization {

    private EXTRA_TIME_MILLISECS = 2000;
      
    public authorizationCode: string;
    public authCodeExpiryMillisecs = 0;
    public accessToken: string;
    public accessTokenExpiryMillisecs = 0;
    public refreshToken: string;

    constructor() {      
    }

    applyAuthTokenResponse(data: any) {
        this.accessToken = data['access_token'];
        let expiresSecs = data['expires_in'] || 0;
        this.authCodeExpiryMillisecs = this.getCurrentMillisecs() + (expiresSecs * 1000);
        this.refreshToken = data['refresh_token'];
    }  

    hasValidAccessToken() {
        return this.accessToken && 
                (this.accessTokenExpiryMillisecs > 
                    this.getCurrentMillisecs() + this.EXTRA_TIME_MILLISECS);
    }

    hasValidAuthorizationCode() {
        return this.authorizationCode && 
                (this.authCodeExpiryMillisecs > 
                    this.getCurrentMillisecs() + this.EXTRA_TIME_MILLISECS);
    }    

    setAuthorizationCode(authCode) {
        this.authorizationCode = authCode;
        this.authCodeExpiryMillisecs = this.getCurrentMillisecs() + (10 * 60 * 1000);
    }

    static fromJson(json: any) : FitbitAuthorization {
        let fitbitAuthorization = new FitbitAuthorization();
        fitbitAuthorization.authorizationCode = json.authorizationCode;    
        fitbitAuthorization.authCodeExpiryMillisecs = json.authCodeExpiryMillisecs || 0;             
        fitbitAuthorization.accessToken = json.accessToken;
        fitbitAuthorization.accessTokenExpiryMillisecs = json.accessTokenExpiryMillisecs || 0; 
        fitbitAuthorization.refreshToken = json.refreshToken;                
        return fitbitAuthorization;
    }       

    private getCurrentMillisecs(): number {
        return new Date().getTime();
    }
    
}