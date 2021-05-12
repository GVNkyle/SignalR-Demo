import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Employee } from '../models/employee';

export interface EmployeeState extends EntityState<Employee, string> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'employees' })
export class EmployeeStore extends EntityStore<EmployeeState>{
    constructor() {
        super();
    }

}