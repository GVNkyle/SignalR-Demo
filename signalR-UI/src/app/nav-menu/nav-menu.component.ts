import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { NotificationCountResult, NotificationResult } from '../_core/models/notification';
import { NotificationService } from '../_core/services/notification.service';
import { ModalService } from '../_core/services/modal.service';
import { SignalrService } from '../_core/services/signalr.service';
import { Router } from '@angular/router';
import { AuthService } from '../_core/services/auth.service';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  notification: NotificationCountResult;
  messages: Array<NotificationResult> = [];
  errorMessage = '';

  constructor(
    private notificationService: NotificationService,
    private modalService: ModalService,
    private signalRService: SignalrService,
    private router: Router,
    private authService: AuthService) { }
  flag: boolean = false;
  isExpanded = false;

  ngOnInit(): void {
    this.getNotificationCount();
    this.getNotificationMessage();
    let connection = this.signalRService.connectSignalR();
    this.authService.loggedIn() ? this.flag = !this.flag : this.flag;

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
      this.notificationService.deleteNotifications().subscribe(res => {
        if (res.success) {
          this.closeModal();
          this.getNotificationCount();
        }
      }, err => {
        this.errorMessage = err;
      });

    }
  }
  openModal() {
    this.getNotificationMessage();
    this.modalService.open('custom-modal');
  }

  closeModal() {
    this.modalService.close('custom-modal');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.flag = false;
    this.router.navigate(['/']);
  }
}
