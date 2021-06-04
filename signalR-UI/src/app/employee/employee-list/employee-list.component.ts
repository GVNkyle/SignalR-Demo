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
@UntilDestroy()
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  pageTitle = 'Employee List';
  filteredEmployees: Employee[] = [];
  employees: Employee[] = [];
  errorMessage = '';
  sortName = 'asc';
  sortAddress = 'asc';
  _listFilter = '';
  constructor(
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private signalRService: SignalrService,
    private employeeQuery: EmployeeQuery,
    private employeeStore: EmployeeStore,
    private router: Router
  ) { }

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredEmployees = this.listFilter ? this.performFilter(this.listFilter) : this.employees;
  }
  performFilter(filterBy?: string): Employee[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.employees.filter((employee: Employee) =>
      employee.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    timer(1000).pipe(switchMap(() => this.employeeService.getEmployees(this.sortName, this.sortAddress))).subscribe();
    this.getEmployeeData();

    this.employeeQuery
      .selectLoading()
      .pipe(untilDestroyed(this))
      .subscribe(isLoading => isLoading ? this.spinner.show() : this.spinner.hide());

    let connection = this.signalRService.connectSignalR();

    connection.on("BroadcastMessage", () => {
      this.getEmployeeData();
    });
  }

  getEmployeeData() {
    this.employeeQuery.selectAll().pipe(untilDestroyed(this)).subscribe(employees => {
      this.employees = employees;
      this.filteredEmployees = this.employees;
    })
  }

  deleteEmployee(id: string, name: string): void {
    if (id === '') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Employee: ${name}?`)) {
        this.employeeService.deleteEmployee(id)
          .pipe(untilDestroyed(this))
          .subscribe(() => this.onSaveComplete());
      }
    }
  }
  onSaveComplete(): void {
    this.employeeQuery.selectAll().pipe(untilDestroyed(this)).subscribe(employees => {
      this.employees = employees;
      this.filteredEmployees = this.employees;
    });
  }

  goToEdit(id?: string) {
    if (id) {
      this.employeeStore.setActive(id);
      this.router.navigate(['/employees/' + id + '/edit']);
    }
    else {
      this.router.navigate(['/employees/0/edit']);
    }
  }

  sort(typeSort) {
    if (typeSort == 'name') {
      this.sortName = (this.sortName == 'asc') ? 'desc' : 'asc';
    }
    if (typeSort == 'address') {
      this.sortAddress = (this.sortAddress == 'asc') ? 'desc' : 'asc';
    }
    this.employeeService.getEmployees(this.sortName, this.sortAddress).subscribe();
    this.getEmployeeData();
  }


}
