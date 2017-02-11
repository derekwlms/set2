import { Injectable } from '@angular/core';

import { Settings } from '../models/settings-model';
import { Workout } from '../models/workout-model';

import { UploadLoggingService } from './upload-logging-service';

/*
 * FitbitUploadService provider - uploads a completed workout to Fitbit. 
 * Fitbit requires OAuth 2 authentication; using Auth0 for that:
 *      https://auth0.com/docs/connections/social/fitbit
 *      https://manage.auth0.com/
 *      https://www.fitbit.com/user/profile/apps
 *      https://dev.fitbit.com/apps/ 
 *      https://github.com/auth0/angular2-jwt 
 *      https://www.fitbit.com/oauth2/authorize   (authZ)
 *      https://api.fitbit.com/oauth2/token       (token request/refresh)
 *      
*/
@Injectable()
export class FitbitUploadService {

  private FITBIT_WORKOUT_URL = 'https://api.fitbit.com';  // '/fitbit'; 

  constructor(public uploadLoggingService: UploadLoggingService) { }

  uploadWorkout(settings: Settings, workout: Workout) : void {
    if (!settings.auth0clientId || !settings.auth0domain) {
      this.logMessage('To enable Fitbit uploads, configure Fitbit and Auth0 parameters in Settings.', null);
      return;
    }
    if (!settings.auth0clientId) { // !auth.authenticated()) {
      this.logMessage('To enable Fitbit uploads, go to Settings and log in.', null);
      return;
    }  
    // TODO Finish
    this.logMessage('Fitbit upload isn\'t coded yet.', this.FITBIT_WORKOUT_URL);      
  }

  private logMessage(message: string, arg: any) {
    this.uploadLoggingService.logMessage('fitbit', message, arg);
  }

}
