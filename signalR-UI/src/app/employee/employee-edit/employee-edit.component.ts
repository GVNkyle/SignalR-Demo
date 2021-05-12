import { Component, OnInit, OnDestroy, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../_core/models/employee';
import { EmployeeService } from '../../_core/services/employee.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmployeeQuery } from 'src/app/_core/queries/employee.query';
import { EmployeeStore } from 'src/app/_core/stores/employee.store';

@UntilDestroy()
@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  pageTitle = 'Employee Edit';
  errorMessage: string;
  employeeForm: FormGroup;
  tranMode: string;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private employeeQuery: EmployeeQuery,
    private employeeStore: EmployeeStore) {

    this.validationMessages = {
      name: {
        required: 'Employee name is required.',
        minlength: 'Employee name must be at least three characters.',
        maxlength: 'Employee name cannot exceed 50 characters.'
      },
      cityname: {
        required: 'Employee city name is required.',
      }
    };
    this.employeeForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: '',
      cityname: ['', [Validators.required]],
      gender: '',
      company: '',
      designation: '',
    });
  }

  ngOnInit() {
    let employees = this.employeeQuery.getActive() as Employee;
    if (employees) {
      this.pageTitle = `Edit Employee`;
      this.employeeForm.patchValue(employees);
      this.tranMode = "edit";
      this.employeeStore.removeActive(employees.id);
    } else {
      this.pageTitle = "Add Employee";
      this.tranMode = "new";
    }
  }

  saveEmployee(employee: Employee): void {
    if (this.employeeForm.valid) {
      if (this.employeeForm.dirty) {
        if (this.tranMode == 'new') {
          this.employeeService.createEmployee(employee).pipe(untilDestroyed(this))
            .subscribe(() => this.onSaveComplete());
        } else {
          this.employeeService.updateEmployee(employee).pipe(untilDestroyed(this))
            .subscribe(() => this.onSaveComplete());
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.employeeForm.reset();
    this.router.navigate(['/employees']);
  }
  cancel() {
    this.router.navigate(['/employees']);
  }

  // displayEmployee(employee: Employee): void {
  //   if (this.employeeForm) {
  //     this.employeeForm.reset();
  //   }
  //   this.employee = employee;
  //   if (this.employee.id == '0') {
  //     this.pageTitle = 'Add Employee';
  //   } else {
  //     this.pageTitle = `Edit Employee: ${this.employee.name}`;
  //   }
  //   this.employeeForm.patchValue({
  //     name: this.employee.name,
  //     address: this.employee.address,
  //     gender: this.employee.gender,
  //     company: this.employee.company,
  //     designation: this.employee.designation,
  //     cityname: this.employee.cityname
  //   });
  // }

  // getEmployee(id: string): void {
  //   this.employeeService.getEmployee(id)
  //     .subscribe(
  //       (employee: Employee) => this.displayEmployee(employee),
  //       (error: any) => this.errorMessage = <any>error
  //     );
  // }
  // saveEmployee(): void {
  //   if (this.employeeForm.valid) {
  //     if (this.employeeForm.dirty) {
  //       const p = { ...this.employee, ...this.employeeForm.value };
  //       if (p.id === '0') {
  //         this.employeeService.createEmployee(p)
  //           .subscribe(
  //             () => this.onSaveComplete(),
  //             (error: any) => this.errorMessage = <any>error
  //           );
  //       } else {
  //         this.employeeService.updateEmployee(p)
  //           .subscribe(
  //             () => this.onSaveComplete(),
  //             (error: any) => this.errorMessage = <any>error
  //           );
  //       }
  //     } else {
  //       this.onSaveComplete();
  //     }
  //   } else {
  //     this.errorMessage = 'Please correct the validation errors.';
  //   }
  // }

  // deleteEmployee(): void {
  //   if (this.employee.id == '0') {
  //     this.onSaveComplete();
  //   } else {
  //     if (confirm(`Are you sure want to delete this Employee: ${this.employee.name}?`)) {
  //       this.employeeService.deleteEmployee(this.employee.id)
  //         .subscribe(
  //           () => this.onSaveComplete(),
  //           (error: any) => this.errorMessage = <any>error
  //         );
  //     }
  //   }
  // }


}
