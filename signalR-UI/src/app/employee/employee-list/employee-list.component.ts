import { Component, OnInit } from '@angular/core';
import { Employee } from '../../_core/models/employee';
import { EmployeeService } from '../../_core/services/employee.service';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignalrService } from 'src/app/_core/services/signalr.service';
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

  _listFilter = '';
  constructor(private employeeService: EmployeeService, private spinner: NgxSpinnerService, private signalRService: SignalrService) { }

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredEmployees = this.listFilter ? this.performFilter(this.listFilter) : this.employees;
  }
  performFilter(filterBy: string): Employee[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.employees.filter((employee: Employee) =>
      employee.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
    this.getEmployeeData();

    let connection = this.signalRService.connectSignalR();

    connection.on("BroadcastMessage", () => {
      this.getEmployeeData();
    });
  }

  getEmployeeData() {
    this.employeeService.getEmployees().subscribe(
      employees => {
        this.employees = employees;
        this.filteredEmployees = this.employees;
      },
      error => this.errorMessage = <any>error
    );
  }

  deleteEmployee(id: string, name: string): void {
    if (id === '') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Employee: ${name}?`)) {
        this.employeeService.deleteEmployee(id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }
  onSaveComplete(): void {
    this.employeeService.getEmployees().subscribe(
      employees => {
        this.employees = employees;
        this.filteredEmployees = this.employees;
      },
      error => this.errorMessage = <any>error
    );
  }
}
