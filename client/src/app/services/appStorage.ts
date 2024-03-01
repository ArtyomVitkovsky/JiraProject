import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AppStorage {
    constructor(
    ) { }

    public saveUser(user: any): void {
        window.localStorage.setItem('user', JSON.stringify(user));
    }

    public getUser(): any {
        const value = window.localStorage.getItem('user');
        return value ? JSON.parse(value) : value;
    }

    public saveSelectedProject(selectedEmployeeProject: any): void {
        var json = JSON.stringify(selectedEmployeeProject);
        console.log(json);
        window.localStorage.setItem('selectedEmployeeProject', json);
    }

    public getSelectedProject(): any {
        const value = window.localStorage.getItem('selectedEmployeeProject');
        console.log(value);
        return value ? JSON.parse(value) : value;
    }
}