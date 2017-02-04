import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Notebook } from '../models/notebook-model';

/*
  WorkoutRetrievalService provider - retrieves an initial workout notebook from an external source.
  It's currently retrieved from the local notebook.json file; maybe later we'll add a REST service for that.
*/
@Injectable()
export class WorkoutRetrievalService {

  constructor(public http: Http) {
  }

  fetchNotebook(doneCallback: Function): void {
    this.http.get('assets/data/notebook.json')
      .map(res => res.json())
      .subscribe(data => {
        let notebook = Notebook.fromJson(data.notebook || {});
        console.log('retrieved workout notebook',notebook);
        doneCallback(notebook);
      },
      err => {
        console.log('error retrieving workout notebook', err);
      });     
  }

}
