import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import { Exercise } from '../models/exercise-model';
import { ExerciseSet } from '../models/exercise-set-model';
import { Settings } from '../models/settings-model';
import { Workout } from '../models/workout-model';

import { UploadLoggingService } from './upload-logging-service';

/*
 * FitlinxxUploadService provider - uploads a completed workout to Fitlinxx. 
 * Fitlinxx has no API so we scrape the web site.
*/
@Injectable()
export class FitLinxxUploadService {

  private FITLINXX_LOGIN_URL = 'https://flxpro.fitlinxx.com';  // '/flxpro'; 
  private FITLINXX_WORKOUT_URL = 'https://www.fitlinxx.com';  // '/fitlinxx';   

  constructor(public http: Http,
              public uploadLoggingService: UploadLoggingService) {
  }

  uploadWorkout(settings: Settings, workout: Workout) : void {
    if (!settings.fitLinxxUserId || !settings.fitLinxxPassword) {
      this.logMessage('To enable FitLinxx uploads, add your FitLinxx user ID and password to Settings', null);
      return;
    }
    let self = this;
    this.login(settings, function() {
      let body = new URLSearchParams();
      self.setWorkoutParameters(body, settings, workout);      
      for (let exercise of workout.exercises) {
        if (exercise.done) {
          self.addExerciseParameters(body, exercise);
        }
      }
      self.sendWorkout(body);      
    });
  }

  private login(settings: Settings, nextStep: Function) : void {
    this.http.get(this.FITLINXX_LOGIN_URL + '/Login.aspx', { withCredentials: true })   
      // .map(res => res.json())
      .subscribe(res => {
        this.logMessage('Fitlinxx login page', res);
        // Parse __VIEWSTATE and __EVENTVALIDATION from loginPage.  
        // Hat tip: https://github.com/jhubble/stravaToFitlinxx
        let loginPage: string = res.text();
        let loginPageSplit = loginPage.split(/name="__VIEWSTATE".*?value="(.*?)"/);
        let viewState = loginPageSplit[1];
        loginPageSplit = loginPage.split(/name="__VIEWSTATEGENERATOR".*?value="(.*?)"/);
        let viewStateGenerator = loginPageSplit[1];        
        loginPageSplit = loginPage.split(/name="__EVENTVALIDATION".*?value="(.*?)"/);
        let eventValidation = loginPageSplit[1];
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        let body = new URLSearchParams();
        body.set('__EVENTTARGET', 'id_btnLogMeIn');
        body.set('__EVENTARGUMENT', '');
        body.set('__EVENTVALIDATION', eventValidation);
        body.set('__LASTFOCUS', '');       
        body.set('__VIEWSTATE', viewState);
        body.set('__VIEWSTATEGENERATOR', viewStateGenerator); 
        body.set('hdPanelOpenReset', 'none');         
        body.set('id_txtEmailConfirm', '');          
        body.set('id_username', settings.fitLinxxUserId);        
        body.set('id_userpassword', settings.fitLinxxPassword);                        
        this.http.post(this.FITLINXX_LOGIN_URL + '/Login.aspx', 
                        body.toString(), { headers: headers, withCredentials: true })
          .subscribe(res => {
            this.logMessage('FitLinxx login response: ', res);
            // Parse Location: and do the redirect
            let loginResponse: string = res.text();
            let loginResponseSplit = loginResponse.split('Location:(.*$)');
            let redirectLocation = loginResponseSplit[1];
            this.logMessage('Redirecting after login', redirectLocation);         
            this.http.get(redirectLocation, { withCredentials: true })
              .subscribe(res => {
                this.logMessage('Redirect after login complete', res);               
                nextStep();
              }, err => {
                this.logMessage('Error redirecting after login', err);
              });
          }, err => {
            this.logMessage('Error posting Fitlinxx login', err);
          });
      }, err => {
        this.logMessage('Error getting Fitlinxx login page', err);
      });         
  };

  private logMessage(message: string, arg: any) {
    this.uploadLoggingService.logMessage('fitlinxx', message, arg);
  }


  private sendWorkout(body: URLSearchParams) : void {
    this.http.post(this.FITLINXX_WORKOUT_URL + '/workout/LogStrength.asp', // ?WebOnlyMember=False
                        body.toString(), { withCredentials: true })
      .subscribe(exerciseResponse => {
        this.logMessage('Workout posted to Fitlinxx', exerciseResponse);        
      },
      err => {
        this.logMessage('Error sending workout to Fitlinxx', err);        
      });
  }


  private setWorkoutParameters(params: URLSearchParams, settings: Settings, workout: Workout) : void {
    let workoutDate: Date = new Date();
    params.set('logit', '1');
    params.set('wday', '' + workoutDate.getDate());
    params.set('wyear', '' + workoutDate.getFullYear());
    params.set('wmonth', '' + workoutDate.getMonth());
    params.set('cardiotype', '');
    params.set('cardioinitialize', 'true');
    params.set('bodyweight', '175'); // TODO settings.bodyWeight;
  }  

  private addExerciseParameters(params: URLSearchParams, exercise: Exercise) : void {
    if (exercise.fitlinxxId) {
        params.set('exer' + exercise.fitlinxxId, 'on');
        for (let i=0; i < exercise.sets.length; i++) {
          let exerciseSet: ExerciseSet = exercise.sets[i];
          params.set('set' + i+1 + 'w_' + exercise.fitlinxxId, '' + exerciseSet.weight);
          params.set('set' + i+1 + 'r_' + exercise.fitlinxxId, '' + exerciseSet.reps);          
        }
    }
  }

}
