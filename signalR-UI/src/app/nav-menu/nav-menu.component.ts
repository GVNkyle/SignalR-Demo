import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

import { NotificationCountResult, NotificationResult } from '../_core/models/notification';
import { NotificationService } from '../_core/services/notification.service';
import { ModalService } from '../_core/services/modal.service';
import { SignalrService } from '../_core/services/signalr.service';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  notification: NotificationCountResult;
  messages: Array<NotificationResult> = [];
  errorMessage = '';

  constructor(private notificationService: NotificationService, private modalService: ModalService, private signalRService: SignalrService) { }

  isExpanded = false;

  ngOnInit(): void {
    this.getNotificationCount();
    this.getNotificationMessage();
    let connection = this.signalRService.connectSignalR();

    connection.on("BroadcastMessage", () => {
      this.getNotificationCount();
    });

  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(
      notification => {
        this.notification = notification;
      },
      error => this.errorMessage = <any>error
    );
  }

  getNotificationMessage() {
    this.notificationService.getNotificationMessage().subscribe(
      messages => {
        this.messages = messages;
      },
      error => this.errorMessage = <any>error);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  deleteNotifications(): void {
    if (confirm(`Are you sure want to delete all notifications?`)) {
      this.notificationService.deleteNotifications()
        .subscribe(
          () => {
            this.closeModal();
          },
          (error: any) => this.errorMessage = <any>error
        );
    }
  }
  openModal() {
    this.getNotificationMessage();
    this.modalService.open('custom-modal');
  }

  closeModal() {
    this.modalService.close('custom-modal');
  }

}
