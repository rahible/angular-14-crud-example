import { Role } from './role';

export class User {
    id?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;

    constructor(init?: Partial<User>) {
      Object.assign(this, init);
    }
}
