import { Injectable } from '@angular/core';
import { enableAkitaProdMode, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee';
import { Pagination } from '../utilities/pagination';


export interface EmployeeState extends EntityState<Employee, string> {
    pagination: Pagination;
}

export function createInitialState(): EmployeeState {
    return {
        pagination: {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPage: 0
        } as Pagination
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'employees' })
export class EmployeeStore extends EntityStore<EmployeeState>{
    constructor() {
        super(createInitialState());
        if (environment.production) {
            enableAkitaProdMode();
        }
    }

}