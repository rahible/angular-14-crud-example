import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users?: any[];
    filteredUsers?: any[];
    filterForm: FormGroup;
    roles: string[] = ['Admin', 'User'];

    constructor(private userService: UserService, private fb: FormBuilder) {
        this.filterForm = this.fb.group({
            name: [''],
            role: ['']
        });
    }

    ngOnInit() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => {
                this.users = users;
                this.applyFilters();
            });
        this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    }

    applyFilters() {
        if (!this.users) return;
        const { name, role } = this.filterForm.value;
        this.filteredUsers = this.users.filter(user => {
            const matchesName = name ? (`${user.title} ${user.firstName} ${user.lastName}`.toLowerCase().includes(name.toLowerCase())) : true;
            const matchesRole = role ? user.role === role : true;
            return matchesName && matchesRole;
        });
    }

    clearFilters() {
        this.filterForm.reset({ name: '', role: '' });
    }

    deleteUser(id: string) {
        const user = this.users!.find(x => x.id === id);
        user.isDeleting = true;
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users!.filter(x => x.id !== id);
                this.applyFilters();
            });
    }
}