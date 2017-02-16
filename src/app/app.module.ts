import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

import { ActivityService } from '../providers/activity-service';
import { EmailSendService } from '../providers/email-send-service';
import { FitbitUploadService } from '../providers/fitbit-upload-service';
import { FitLinxxUploadService } from '../providers/fitlinxx-upload-service';
import { UploadLoggingService } from '../providers/upload-logging-service';
import { WorkoutRetrievalService } from '../providers/workout-retrieval-service';
import { WorkoutService } from '../providers/workout-service';
import { WorkoutUploadService } from '../providers/workout-upload-service';

import { AboutPage } from '../pages/about/about';
import { AddExercisePage } from '../pages/add-exercise/add-exercise';
import { ExercisePage } from '../pages/exercise/exercise';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { UploadPage } from '../pages/upload/upload';
import { WorkoutPage } from '../pages/workout/workout';

@NgModule({
  declarations: [
    AboutPage,
    AddExercisePage,
    ExercisePage,
    HomePage,    
    MyApp,
    SettingsPage,
    UploadPage,    
    WorkoutPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AboutPage,
    AddExercisePage,    
    ExercisePage,    
    HomePage,
    MyApp,    
    SettingsPage,
    UploadPage,    
    WorkoutPage
  ],
  providers: [  
    ActivityService,
    EmailSendService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },      
    FitbitUploadService,    
    FitLinxxUploadService,    
    Storage,
    UploadLoggingService,
    WorkoutRetrievalService,    
    WorkoutService,
    WorkoutUploadService,     
  ]
})

export class AppModule {}
