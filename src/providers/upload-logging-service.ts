import { Injectable } from '@angular/core';

/*
  UploadLoggingService provider - Supports shared logging for uploads. 
*/
@Injectable()
export class UploadLoggingService {

  public messages: Array<Array<string>> = [];

  constructor() {
    this.messages['summary'] = [];
    this.messages['email'] = [];
    this.messages['fitbit'] = [];
    this.messages['fitlinxx'] = [];
  }

  logMessage(type: string, message: string, arg: any) {
    console.log(message, type, arg); 
    let msgs: Array<string> = this.messages[type];
    if (!msgs) {
      msgs = new Array<string>();
      this.messages[type] = msgs;
    }
    if (arg) {
      msgs.push(message + ': ' + arg);
    } else {
      msgs.push(message);
    }
  }

}
