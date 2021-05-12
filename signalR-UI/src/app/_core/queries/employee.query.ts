import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EmployeeState, EmployeeStore } from '../stores/employee.store';

@Injectable({ providedIn: 'root' })
export class EmployeeQuery extends QueryEntity<EmployeeState> {
    constructor(protected store: EmployeeStore) {
        super(store);
    }

}