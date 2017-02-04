import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Activity } from '../models/activity-model';

/*
  ActivityService provider - retrieves available exercise activities.
  This list is currently retrieved from the local activities.json file,
  but maybe later we'll add a REST service for that.
*/
@Injectable()
export class ActivityService {

  activities: any;

  constructor(public http: Http) {
  }

  loadActivities(): any {
    if (this.activities) {
      return Observable.of(this.activities);
    } else {
      return this.http.get('assets/data/activities.json')
        .map(res => res.json())
        .subscribe(data => {
          this.activities = Activity.fromJsonArray(data.activities || []);          
          console.log('loaded activities', this.activities);
        },
        err => {
          console.log('error loading activities', err);
        });     
    }
  }  

}
