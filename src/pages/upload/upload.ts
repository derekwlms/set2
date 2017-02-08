import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EmailSendService } from '../../providers/email-send-service';
import { UploadLoggingService } from '../../providers/upload-logging-service';
import { WorkoutService } from '../../providers/workout-service';

import { Workout } from '../../models/workout-model';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {
  
  @ViewChild('formattedWorkout') formattedWorkoutElement: ElementRef;

  public workout: Workout;
  public workoutCompleteDate: Date;

  public messageTypeFilter: string = 'summary';
  public selectedMessages: Array<string> = this.uploadLoggingService.messages['summary'];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public emailSendService: EmailSendService,
              public uploadLoggingService: UploadLoggingService,
              public workoutService: WorkoutService) {

    this.workout = workoutService.getCurrentWorkout();
    this.workoutCompleteDate = new Date();    
  }

  ngAfterViewInit() {
    this.workoutCompleteDate = new Date();
    this.emailSendService.emailBody = this.formattedWorkoutElement.nativeElement.innerHTML;
  }

  updateSelectedMessages() {
    this.selectedMessages = this.uploadLoggingService.messages[this.messageTypeFilter];    
  }

}
