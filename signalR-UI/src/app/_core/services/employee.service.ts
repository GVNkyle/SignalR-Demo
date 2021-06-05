import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Employee } from '../models/employee';
import { environment } from 'src/environments/environment';
import { EmployeeStore } from '../stores/employee.store';
import { debug } from 'console';
import { Pagination, PaginationResult } from '../utilities/pagination';
import { SortParams } from '../models/sort-params';
import { OperationResult } from '../utilities/operation-result';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesUrl = environment.baseUrl + 'api/employees/';
  constructor(private http: HttpClient, private employeeStore: EmployeeStore) { }

  getEmployees(sort: SortParams[], pagination: Pagination, filter: string) {
    let params = new HttpParams()
      .set("pageNumber", pagination.currentPage.toString())
      .set("pageSize", pagination.pageSize.toString())
      .set("filter", filter);
    return this.http.post<PaginationResult<Employee>>(`${this.employeesUrl}GetAll`, sort, { params })
      .pipe(tap(res => {
        this.employeeStore.set(res.result);
        this.employeeStore.update({ pagination: res.pagination });
      }));
  }

  createEmployee(employee: Employee) {
    return this.http.post<OperationResult>(this.employeesUrl + 'create', employee)
      .pipe(tap(res => {
        if (res.success)
          this.employeeStore.add(employee);
      }))
  }

  deleteEmployee(id: string) {
    const url = `${this.employeesUrl}${id}`;
    return this.http.delete<OperationResult>(url)
      .pipe(tap(res => {
        if (res.success)
          this.employeeStore.remove(id);
      }))
  }

  updateEmployee(employee: Employee) {
    const url = `${this.employeesUrl}${employee.id}`;
    return this.http.put<OperationResult>(url, employee)
      .pipe(tap(res => {
        if (res.success)
          this.employeeStore.update(employee.id, employee);
      }));
  }


}
