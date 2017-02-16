import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import { ExerciseGroup } from '../models/exercise-group-model';
import { Settings } from '../models/settings-model';
import { Workout } from '../models/workout-model';

import { UploadLoggingService } from './upload-logging-service';

/*
 * FitbitUploadService provider - uploads a completed workout to Fitbit. 
 * Uses https://dev.fitbit.com/docs/activity/#log-activity.
 * 
 * Fitbit requires OAuth 2 authentication:
 *      https://www.fitbit.com/user/profile/apps
 *      https://dev.fitbit.com/apps/ 
 *      https://www.fitbit.com/oauth2/authorize   (authZ)
 *      https://api.fitbit.com/oauth2/token       (token request/refresh) 
 * 
 * Currently authorizing outside this app, but may add it here using Auth0:
 *      https://auth0.com/docs/connections/social/fitbit
 *      https://manage.auth0.com/
 * Auth0's client uses a buncha stuff:
 *      https://www.npmjs.com/package/auth0-lock
 *      https://www.npmjs.com/package/auth0-js
 *      https://github.com/auth0/angular2-jwt 
 *      
*/
@Injectable()
export class FitbitUploadService {

  private FITBIT_AUTHORIZE_URL = 'https://www.fitbit.com/oauth2/authorize';  // '/fitbit/authorize'; 
  private FITBIT_TOKEN_URL = 'https://api.fitbit.com/oauth2/token ';  // '/fitbit/token';   
  private FITBIT_LOG_ACTIVITY_URL = 'https://api.fitbit.com/1/user/-/activities.json';  // '/fitbit/activity'; 

  constructor(public http: Http,
              public uploadLoggingService: UploadLoggingService) { }

  uploadWorkout(settings: Settings, workout: Workout) : void {

    if (!settings.fitbitClientId || !settings.fitbitClientSecret || !settings.fitbitRedirectUri) {
      this.logMessage('To enable Fitbit uploads, configure Fitbit parameters in Settings.', null);
      return;
    }
    /*
    if (!auth.authenticated()) {
      this.logMessage('To enable Fitbit uploads, go to Settings and log in.', null);
      return;
    }  
    */
    // TODO Maybe convert to promise chain or observable stream    
    let self = this;
    this.getAccessToken(settings, function(accessToken) { 
      self.sendWorkout(accessToken, workout); 
    });       
  }

  private getAccessToken(settings: Settings, nextStep: Function) : void {  
    let self = this;  
    this.checkAuthorizationCode(settings, function(authorizationCode) {
      let headers = new Headers();
      let encodedAuth = btoa(settings.fitbitClientId + ':' + settings.fitbitClientSecret);
      headers.append('Authorization', 'Basic ' + encodedAuth);        
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      let body = new URLSearchParams();
      body.set('client_id', settings.fitbitClientId);
      body.set('grant_type', 'authorization_code'); 
      body.set('redirect_uri', settings.fitbitRedirectUri);         
      body.set('code', authorizationCode);                              
      self.http.post(self.FITBIT_TOKEN_URL, body.toString(), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          self.logMessage('Fitbit token response: ', data.access_token);           
          nextStep(data.access_token);              
        }, err => {
          self.logMessage('Error getting Fitbit auth token', err);
        });      
    }); 
  };  

  private checkAuthorizationCode(settings: Settings, nextStep: Function) : void {  
    if (settings.fitbitAuthorizationCode) {
      nextStep(settings.fitbitAuthorizationCode);
    } else {
      this.getAuthorizationCode(settings, nextStep);
    }
  }

  private getAuthorizationCode(settings: Settings, nextStep: Function) {
    let params = new URLSearchParams();
    params.set('response_type', 'code');
    params.set('client_id', settings.fitbitClientId);    
    params.set('redirect_uri', settings.fitbitRedirectUri);    
    params.set('scope', 'activity');       
    this.http.get(this.FITBIT_AUTHORIZE_URL, { search: params })   
      .subscribe(res => {
        this.logMessage('Fitbit authorization code response', res);
        // Get authorizationCode ("code") from the redirect URL (response header location): 
        let location = res.headers.get('location');
        let locationSplit = location.split(/code=/);
        let authorizationCode = locationSplit[1];        
        nextStep(authorizationCode);
      }, err => {
        this.logMessage('Error getting Fitbit authorization code', err);
      });       
  }

  private logMessage(message: string, arg: any) {
    this.uploadLoggingService.logMessage('fitbit', message, arg);
  }

  private sendWorkout(accessToken: string, workout: Workout) {
    let exerciseGroups = ExerciseGroup.groupCompletedExercises(workout.exercises, 'fitbitId');
    for (let groupId in exerciseGroups) {
      this.sendExerciseGroup(accessToken, exerciseGroups[groupId]);
    }     
  }

  private sendExerciseGroup(accessToken: string, exerciseGroup: ExerciseGroup) : void {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + accessToken);   
    headers.append('Content-Type', 'application/x-www-form-urlencoded');        
    let body = new URLSearchParams();    
    body.set('activityId', exerciseGroup.groupId);
    // Smaller than moment.js:
    let dateArray = (exerciseGroup.startDate || new Date()).toISOString().split('T');
    body.set('date', '' + dateArray[0]);
    body.set('startTime', '' + dateArray[1].split('.')[0]);    
    body.set('durationMillis', '' + exerciseGroup.durationMillisecs);
    this.http.post(this.FITBIT_LOG_ACTIVITY_URL, body.toString(), { headers: headers })
      .subscribe(exerciseResponse => {
        this.logMessage('Activity logged to Fitbit', exerciseResponse);        
      },
      err => {
        this.logMessage('Error sending workout to Fitbit', err);        
      });
  }  
 
}
