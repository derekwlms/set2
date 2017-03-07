import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AboutPage } from '../pages/about/about';
import { HistoryPage } from '../pages/history/history';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { UploadPage } from '../pages/upload/upload';
import { WorkoutPage } from '../pages/workout/workout';

import { ActivityService } from '../providers/activity-service';
import { WorkoutService } from '../providers/workout-service';

export interface PageDefinition {
  component: any;
  icon: string;
  title: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  adminPages: PageDefinition[];  
  infoPages: PageDefinition[];   
  workoutPages: PageDefinition[];

  constructor(public platform: Platform, 
              public activityService : ActivityService, 
              public workoutService : WorkoutService) {
    this.initializeApp();

    this.workoutPages = [
      { title: 'Home', icon: 'home', component: HomePage},
      { title: 'Workout', icon: 'body', component: WorkoutPage },
      { title: 'History', icon: 'folder', component: HistoryPage }             
    ];

    this.adminPages = [
      { title: 'Upload', icon: 'cloud-upload', component: UploadPage },
      { title: 'Settings', icon: 'settings', component: SettingsPage }         
    ];    

    this.infoPages = [
      { title: 'FitLinxx', icon: 'link', component: 'https://fitlinxx.com' },      
      { title: 'About', icon: 'information-circle', component: AboutPage }
    ];     

    workoutService.loadNotebook();
    activityService.loadActivities();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    if (typeof page.component === 'string') {
      window.open(page.component, '_blank');
    } else {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
    }
  }
}
