import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NotificationCountResult, NotificationResult } from '../models/notification';
import { OperationResult } from '../utilities/operation-result';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsUrl = environment.baseUrl + 'api/notifications';

  constructor(private http: HttpClient) { }

  getNotificationCount(): Observable<NotificationCountResult> {
    const url = `${this.notificationsUrl}/getCount`;
    return this.http.get<NotificationCountResult>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getNotificationMessage(): Observable<Array<NotificationResult>> {
    const url = `${this.notificationsUrl}/getAll`;
    return this.http.get<Array<NotificationResult>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteNotifications() {
    const url = `${this.notificationsUrl}/delete`;
    return this.http.delete<OperationResult>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
