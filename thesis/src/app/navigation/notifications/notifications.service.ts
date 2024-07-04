import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Notification from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private apiUrl = 'http://localhost:3000/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  markAsRead(notification: Notification): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${notification._id}`, {
      isRead: true,
    });
  }

  deleteNotification(notification: Notification): Observable<Notification> {
    return this.http.delete<Notification>(`${this.apiUrl}/${notification._id}`);
  }

  markAllAsRead(): Observable<Notification[]> {
    return this.http.patch<Notification[]>(`${this.apiUrl}/all`, {
      isRead: true,
    });
  }
}
