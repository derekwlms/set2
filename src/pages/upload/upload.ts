import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UploadLoggingService } from '../../providers/upload-logging-service';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {

  public messageTypeFilter: string = 'summary';
  public selectedMessages: Array<string> = this.uploadLoggingService.messages['summary'];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public uploadLoggingService: UploadLoggingService) {}

  updateSelectedMessages() {
    this.selectedMessages = this.uploadLoggingService.messages[this.messageTypeFilter];    
  }

}
