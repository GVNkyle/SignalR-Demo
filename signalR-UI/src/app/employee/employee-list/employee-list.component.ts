import { Component, OnInit } from '@angular/core';
import { Employee } from '../../_core/models/employee';
import { EmployeeService } from '../../_core/services/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignalrService } from 'src/app/_core/services/signalr.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EmployeeQuery } from 'src/app/_core/queries/employee.query';
import { EmployeeStore } from 'src/app/_core/stores/employee.store';
import { Router } from '@angular/router';
import { SortBy, SortParams } from 'src/app/_core/models/sort-params';
import { Pagination } from 'src/app/_core/utilities/pagination';
@UntilDestroy()
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  pageTitle = 'Employee List';
  employees: Employee[] = [];
  errorMessage = '';
  filter = '';
  pagination: Pagination = {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPage: 0
  }
  sortColumn = SortColumn;
  sorttype = SortBy;
  sortParams: SortParams[] = [
    {
      sortBy: this.sortColumn.Name,
      sortType: SortBy.Asc
    },
    {
      sortBy: this.sortColumn.Address,
      sortType: SortBy.Asc
    }
  ]
  constructor(
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private signalRService: SignalrService,
    private employeeQuery: EmployeeQuery,
    private employeeStore: EmployeeStore,
    private router: Router
  ) { }



  ngOnInit(): void {

    timer(1000).pipe(switchMap(() => this.employeeService.getEmployees(this.sortParams, this.pagination, this.filter))).subscribe();
    this.getEmployeeData();
    this.employeeQuery
      .selectLoading()
      .pipe(untilDestroyed(this))
      .subscribe(isLoading => isLoading ? this.spinner.show() : this.spinner.hide());

    this.employeeQuery.select(state => state.pagination).subscribe(paginaton => this.pagination = paginaton);
    this.employeeQuery.selectAll().pipe(untilDestroyed(this)).subscribe(employees => this.employees = employees);

    let connection = this.signalRService.connectSignalR();

    connection.on("BroadcastMessage", () => {
      this.getEmployeeData();
    });
  }

  getEmployeeData() {
    this.employeeService.getEmployees(this.sortParams, this.pagination, this.filter).subscribe();
  }

  deleteEmployee(id: string, name: string): void {
    if (id === '') {
      this.getEmployeeData();
    } else {
      if (confirm(`Are you sure want to delete this Employee: ${name}?`)) {
        this.employeeService.deleteEmployee(id)
          .pipe(untilDestroyed(this))
          .subscribe(() => this.getEmployeeData());
      }
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.getEmployeeData();
  }

  goToEdit(id?: string) {
    if (id != '') {
      this.employeeStore.setActive(id);
      this.router.navigate(['/employees/edit']);
    }
    this.router.navigate(['/employees/edit']);
  }

  sort(typeSort: SortColumn) {
    let index = this.sortParams.findIndex(x => x.sortBy == typeSort);
    let currentSortType = this.sortParams[index].sortType;
    this.sortParams[index].sortType = currentSortType === SortBy.Asc ? SortBy.Desc : SortBy.Asc;
    this.getEmployeeData()
  }
  performFilter() {
    this.getEmployeeData()
  }

}
enum SortColumn {
  Name = 'Name',
  Address = 'Address'
}