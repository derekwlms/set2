import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestMethod } from '@angular/http';

import { Settings } from '../models/settings-model';
import { Workout } from '../models/workout-model';

import { UploadLoggingService } from './upload-logging-service';

/*
  EmailSendService provider - sends an email about a completed workout using MailGun. 
*/
@Injectable()
export class EmailSendService {

  private MAILGUN_BASE_URL = 'https://api.mailgun.net/v3/'; 

  constructor(public http: Http,
              public uploadLoggingService: UploadLoggingService) {
  }

  sendEmail(settings: Settings, workout: Workout): void {
    if (!settings.emailAddress || !settings.emailApiKey || !settings.emailDomain) {
      this.logMessage('To enable emails, add your email address and MailGun credentials in Settings', null);
      return;
    }
    let requestHeaders: Headers = new Headers();
    let mailgunApiKey: string = btoa(settings.emailApiKey);
    requestHeaders.append('Authorization', 'Basic ' + mailgunApiKey);
    requestHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    this.http.request(new Request({
        method: RequestMethod.Post,
        url: this.MAILGUN_BASE_URL + settings.emailDomain + '/messages',
        body: 'from=' + settings.emailAddress + '&to=' + settings.emailAddress + 
                '&subject=' + 'Set 2 Workout' + '&text=' + this.formatEmail(workout),
        headers: requestHeaders
    }))
    .subscribe(success => {
        this.logMessage('Email sent', JSON.stringify(success));
    }, error => {
        console.log('Email send error', JSON.stringify(error));
    });
  }

  private formatEmail(workout: Workout): string {
    // TODO Stub. Do real HTML formatting
    return 'Workout completed on ' + new Date(workout.completedMsecs) +
            ', ' + workout.exercises.length + ' exercises';
  }

  private logMessage(message: string, arg: any) {
    this.uploadLoggingService.logMessage('email', message, arg);
  }

}
