import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Employee } from '../models/employee';
import { environment } from 'src/environments/environment';
import { EmployeeStore } from '../stores/employee.store';
import { debug } from 'console';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesUrl = environment.baseUrl + 'api/employees';
  constructor(private http: HttpClient, private employeeStore: EmployeeStore) { }

  getEmployees(sortName: string, sortAddress: string) {
    let params = new HttpParams();
    params = params.append("sortName", sortName);
    params = params.append("sortAddress", sortAddress);
    return this.http.get<Employee[]>(this.employeesUrl, { params })
      .pipe(tap(employees => this.employeeStore.set(employees)))
  }

  getEmployee(id: string): Observable<Employee> {
    if (id === '') {
      return of(this.initializeEmployee());
    }
    const url = `${this.employeesUrl}/${id}`;
    return this.http.get<Employee>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.employeesUrl, employee)
      .pipe(tap(employee => this.employeeStore.add(employee)));
  }

  deleteEmployee(id: string): Observable<{}> {
    const url = `${this.employeesUrl}/${id}`;
    return this.http.delete<Employee>(url)
      .pipe(tap(result => this.employeeStore.remove(id)));
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const url = `${this.employeesUrl}/${employee.id}`;
    return this.http.put<Employee>(url, employee)
      .pipe(tap(result => this.employeeStore.update(employee.id, employee)));
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
  private initializeEmployee(): Employee {
    return {
      id: null,
      name: null,
      address: null,
      gender: null,
      company: null,
      designation: null,
      cityname: null
    };
  }
}
