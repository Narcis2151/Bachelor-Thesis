import { Component, OnInit } from '@angular/core';

import Notification from '../notification.model';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-notitifications-list',
  templateUrl: './notitifications-list.component.html',
  styleUrl: './notitifications-list.component.scss',
})
export class NotitificationsListComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    console.log('NotificationsListComponent initialized');
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationsService.getNotifications().subscribe({
      next: (notifications: Notification[]) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  markAsRead(notification: Notification) {
    this.notificationsService.markAsRead(notification).subscribe({
      next: () => {
        notification.isRead = true;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteNotification(notification: Notification) {
    this.notificationsService.deleteNotification(notification).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(
          (n) => n._id !== notification._id
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.isRead = true));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
