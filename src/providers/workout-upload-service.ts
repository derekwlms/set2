import { Injectable } from '@angular/core';

import { EmailSendService } from './email-send-service';
import { FitLinxxUploadService } from './fitlinxx-upload-service';
import { UploadLoggingService } from './upload-logging-service';

import { Notebook } from '../models/notebook-model';
import { Workout } from '../models/workout-model';

/*
  WorkoutUploadService provider - uploads a completed workout to sync targets. 
*/
@Injectable()
export class WorkoutUploadService {

  constructor(public emailSendService: EmailSendService,
              public fitLinxxUploadService: FitLinxxUploadService,
              public uploadLoggingService: UploadLoggingService) {
  }

  uploadWorkout(notebook : Notebook, workout : Workout): void {
    this.uploadLoggingService.logMessage('summary', 'Uploading to FitLinxx...', null);
    this.fitLinxxUploadService.uploadWorkout(notebook.settings, workout);
    this.uploadLoggingService.logMessage('summary', "Fitbit upload isn't coded yet.", null);    
    // this.fitbitUploadService.uploadWorkout(notebook, workout);    
    this.uploadLoggingService.logMessage('summary', "Sending email...", null);  
    this.emailSendService.sendEmail(notebook.settings, workout);       
  }

}
