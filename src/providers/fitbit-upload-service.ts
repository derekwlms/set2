import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import { ExerciseGroup } from '../models/exercise-group-model';
import { Settings } from '../models/settings-model';
import { Workout } from '../models/workout-model';

import { UploadLoggingService } from './upload-logging-service';

import moment from 'moment';

declare var window: any;

/*
 * FitbitUploadService provider - uploads a completed workout to Fitbit. 
 * Uses https://dev.fitbit.com/docs/activity/#log-activity.
 * 
 * Fitbit requires OAuth 2 authentication:
 *      https://www.fitbit.com/user/profile/apps
 *      https://dev.fitbit.com/apps/ 
 *      https://www.fitbit.com/oauth2/authorize   (authZ)
 *      https://api.fitbit.com/oauth2/token       (token request/refresh)     
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
    let self = this;
    this
      .getCurrentAccessToken(settings)
      .then(accessToken => { 
        self.sendWorkout(accessToken, workout);
      })
      .catch(err => {
        self.logMessage('Error accessing Fitbit', err); 
      });
  }

  login(window: any, settings: Settings) : Promise<any> {
    let self = this;    
    self.logMessage('Opening browser for Fitbit login', null);
    return new Promise(function(resolve, reject) {
      var inAppBrowser = window.cordova.InAppBrowser
        .open(self.FITBIT_AUTHORIZE_URL + 
                  '?response_type=code' +
                  '&client_id=' + settings.fitbitClientId +
                  '&redirect_uri=' + settings.fitbitRedirectUri +
                  '&scope=activity');
      inAppBrowser.addEventListener('loadstart', (event) => {
        self.logMessage('Fitbit login - loadstart', event.url);
        if (event.url.indexOf(settings.fitbitRedirectUri) === 0) {
          inAppBrowser.removeEventListener('exit', (event) => {});
          inAppBrowser.close();
          let urlSplit = event.url.split(/code=/);
          let authorizationCode = (urlSplit[1] || '').split(/#/)[0];          
          if (authorizationCode) {
            settings.fitbitAuthorization.setAuthorizationCode(authorizationCode);            
            resolve(authorizationCode);
          } else {
            reject(self.logMessage('Unable to authenticate with Fitbit', null));
          }
        }
      });
      inAppBrowser.addEventListener('exit', function(event) {
          reject(self.logMessage('Fitbit sign in was cancelled', null));
      });
    });
  }

  private getCurrentAccessToken(settings: Settings) : Promise<any> {  
    if (settings.fitbitAuthorization.hasValidAccessToken()) {
      return new Promise(function(resolve) {
        resolve(settings.fitbitAuthorization.accessToken)});
    }
    if (settings.fitbitAuthorization.refreshToken) {
      return this.refreshAccessToken(settings);
    }
    if (settings.fitbitAuthorization.hasValidAuthorizationCode()) {
      return this.getAccessToken(settings, settings.fitbitAuthorization.authorizationCode);            
    }
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getAuthorizationCode(settings)
        .then(authCode => { 
          self
            .getAccessToken(settings, authCode)
            .then(accessToken => { resolve(accessToken); })
        })
        .catch(err => {
          if (!window || !window.cordova || !window.cordova.InAppBrowser) {
            reject('No InAppBrowser available for  Fitbit login');
            return;
          }
          self
            .login(window, settings)
            .then(authCode => {
              self
                .getAccessToken(settings, authCode)
                .then(accessToken =>  { resolve(accessToken); })
            })
        });  
    }); 
  };  

  private getAccessToken(settings: Settings, authorizationCode: string) : Promise<any> {  
    let self = this;  
    return new Promise(function(resolve, reject) {

      let headers = new Headers();
      let encodedAuth = btoa(settings.fitbitClientId + ':' + settings.fitbitClientSecret);
      headers.append('Authorization', 'Basic ' + encodedAuth);        
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      let body = new URLSearchParams();
      body.set('client_id', settings.fitbitClientId);
      body.set('grant_type', 'authorization_code'); 
      body.set('redirect_uri', settings.fitbitRedirectUri);         
      body.set('code', authorizationCode);   
      // self.logMessage('Getting authorization code - encoded auth', encodedAuth);        
      // self.logMessage('Getting authorization code - body', body.toString());                           
      self.http.post(self.FITBIT_TOKEN_URL, body.toString(), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          self.logMessage('Fitbit token response: ', data);   
          settings.fitbitAuthorization.applyAuthTokenResponse(data);
          resolve(data.access_token);              
        }, err => {
          reject(self.logMessage('Error getting Fitbit auth token', err));
        });      

    });
  };   

  private getAuthorizationCode(settings: Settings) : Promise<any> {
    let self = this;
    return new Promise(function(resolve, reject) {    
      let params = new URLSearchParams();
      params.set('response_type', 'code');
      params.set('client_id', settings.fitbitClientId);    
      params.set('redirect_uri', settings.fitbitRedirectUri);    
      params.set('scope', 'activity');       
      self.http.get(self.FITBIT_AUTHORIZE_URL, { search: params })   
        .subscribe(res => {
          self.logMessage('Fitbit authorization code response', res);
          // Get authorizationCode ("code") from the redirect URL (response header location): 
          let location = res.headers.get('location') || '';
          let locationSplit = location.split(/code=/);
          let authorizationCode = locationSplit[1];   
          if (authorizationCode && authorizationCode.length > 3) {
            resolve(authorizationCode);
          } else {
            reject('Cannot get authorization code via API, will likely have to log in');
          }
        }, err => {
          reject(self.logMessage('Error getting Fitbit authorization code', err));
        });  
    });     
  }

  private refreshAccessToken(settings: Settings) : Promise<any> {
    let self = this;
    return new Promise(function(resolve, reject) {  
      let headers = new Headers();
      let encodedAuth = btoa(settings.fitbitClientId + ':' + settings.fitbitClientSecret);
      headers.append('Authorization', 'Basic ' + encodedAuth);        
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      let body = new URLSearchParams();
      body.set('grant_type', 'refresh_token'); 
      body.set('refresh_token', settings.fitbitAuthorization.refreshToken);                       
      self.http.post(self.FITBIT_TOKEN_URL, body.toString(), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          self.logMessage('Fitbit refresh token response: ', data);   
          settings.fitbitAuthorization.applyAuthTokenResponse(data);
          resolve(data.access_token);              
        }, err => {
          reject(self.logMessage('Error refreshing Fitbit auth token', err));
        }); 
    });      
  }

  private logMessage(message: string, arg: any) {
    this.uploadLoggingService.logMessage('fitbit', message, arg);
    return message;
  }

  private sendWorkout(accessToken: string, workout: Workout) {
    let exerciseGroups = ExerciseGroup.groupCompletedExercises(workout.exercises, 'fitbitId');
    for (let groupId in exerciseGroups) {
      this.sendExerciseGroup(accessToken, exerciseGroups[groupId]);
    }   
    workout.fitBitUploadMsecs = new Date().getTime();      
  }

  private sendExerciseGroup(accessToken: string, exerciseGroup: ExerciseGroup) : void {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + accessToken);   
    headers.append('Content-Type', 'application/x-www-form-urlencoded');        
    let body = new URLSearchParams();    
    body.set('activityId', exerciseGroup.groupId);
    let m = moment(exerciseGroup.startDate || new Date());
    body.set('date', m.format('YYYY-MM-DD'));
    body.set('startTime', m.format('hh:mm:ss'));    
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
