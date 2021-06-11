import { Injectable } from '@angular/core';
import { SnotifyPosition, SnotifyService, SnotifyToastConfig } from 'ng-snotify';

@Injectable({ providedIn: 'root' })
export class CustomNgSnotifyService {
  config: SnotifyToastConfig = {
    bodyMaxLength: 300,
    titleMaxLength: 100,
    backdrop: -1,
    position: SnotifyPosition.rightTop,
    timeout: 3000,
    showProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true
  };

  constructor(private snotifyService: SnotifyService) {
    this.setDefaults();
  }

  setDefaults() {
    this.snotifyService.setDefaults({
      global: {
        maxAtPosition: 10,
        maxOnScreen: 10,
        newOnTop: true,
        filterDuplicates: false
      }
    });
  }

  success(body: string, title: string) {
    this.snotifyService.success(body, title, this.config);
  }

  info(body: string, title: string) {
    this.snotifyService.info(body, title, this.config);
  }

  error(body: string, title: string) {
    this.snotifyService.error(body, title, this.config);
  }

  warning(body: string, title: string) {
    this.snotifyService.warning(body, title, this.config);
  }

  simple(body: string, title: string) {
    this.snotifyService.simple(body, title, this.config);
  }

  confirm(body: string, title: string, okCallback: () => any) {
    const config = { ...this.config };
    config.position = SnotifyPosition.centerCenter;
    config.timeout = 0;

    this.snotifyService.confirm(body, title, {
      ...config,
      buttons: [
        { text: 'OK', action: toast => { this.snotifyService.remove(toast.id); okCallback(); }, bold: true },
        { text: 'Cancel', action: toast => { this.snotifyService.remove(toast.id); } }
      ]
    });
  }

  clear() {
    this.snotifyService.clear();
  }
}
