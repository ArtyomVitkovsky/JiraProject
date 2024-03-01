import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Request } from "src/app/services/request";
import { AppStorage } from "src/app/services/appStorage";
import { Constants } from "src/app/utilities/constants";
import { Router } from "@angular/router";
import { NgxPrintService } from 'ngx-print';
import { PrintOptions } from 'ngx-print';

import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

@Component({
    selector: 'admin-menu',
    templateUrl: './admin-menu.html',
    styleUrls: ['./admin-menu.css'],
    animations: [
        trigger('columnAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1.5s ease', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('0.5s ease', style({ opacity: 0 }))
            ]),

        ]),
    ]
})

export class AdminMenu implements OnInit {

    downloadDataBaseBackupsLink: string = Constants.DOWNLOAD_DATABASE_BACKUPS;

    dataBaseBackups: string[] = [];

    getLogsInterval: any;

    dataBaseLogs: any[] = [];
    logsColumnsNames: string[] = ['dml operation', 'table name', 'old values', 'new values', 'operation date'];

    sqlQuery: string = '';

    requestResultExportLink: string = '';

    currentSelectedTable: string = '';
    showSqlWrapper: boolean = false;
    tablesInformation: any = {};
    requestResultData: any[] = [];
    requestResultColumns: any[] = [];
    objectKeys = Object.keys;
    objectValues = Object.values;

    isLogsVisible: boolean = false;
    isBackupsVisible: boolean = false;

    currentUser: any = {};

    usersAndRoles: any[] = [];
    userRoles: any[] = [];

    requests: any[] = [];

    selectedUser = {
        id: '',
        email: '',
        role_type: ''
    }

    emailToSearch: string = '';

    constructor(
        private request: Request,
        private appStorage: AppStorage,
        private toaster: ToastrService,
        private router: Router,
        private printService: NgxPrintService
    ) { }

    ngOnInit(): void {
        this.initialize();
    }

    initialize() {
        this.currentUser = this.appStorage.getUser();

        this.getUsersAndRoles();
        this.getUserRoles();
        this.getTablesInformation();
    }

    getUsersAndRoles(): void {
        this.request.get(Constants.GET_USERS_AND_ROLES, null)
            .subscribe({
                next: (response) => {
                    console.log(response);

                    this.usersAndRoles = response.usersAndRoles;
                    console.log(this.usersAndRoles);
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    getUserRoles(): void {
        this.request.get(Constants.GET_USER_ROLES, null)
            .subscribe({
                next: (response) => {
                    this.userRoles = response.userRoles;
                    console.log(this.userRoles);
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    selectUser(user: any): void {
        this.selectedUser = user;

        console.warn('selectedUser', user);

        this.getUserRequests();
    }

    searchUsers() {
        if (this.emailToSearch) {
            this.request.get(Constants.FIND_USERS_AND_ROLES, { email: this.emailToSearch })
                .subscribe({
                    next: (response) => {
                        console.log(response);

                        this.usersAndRoles = response.usersAndRoles;
                        console.log(this.usersAndRoles);
                    },
                    error: (error) => {
                        console.log(error);
                        this.toaster.error(error.error.message);
                    }
                })
        }
        else {
            this.getUsersAndRoles();
        }
    }

    getUserRequests(): void {

        const body = {
            userId: this.selectedUser.id
        }

        console.warn('body', body);

        this.requests = [];

        this.request.get(Constants.GET_USER_REQUESTS, body)
            .subscribe({
                next: (response) => {
                    this.requests = response.userRequests;
                    console.warn('requests', this.requests);
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    approveUserRequest(request: any): void {
        const body = {
            id: request.id,
            userId: this.selectedUser.id,
            userRoleId: request.target_role_type_id
        }

        this.request.post(Constants.SET_USER_ROLE, body)
            .subscribe({
                next: (response) => {
                    this.toaster.success('Request approved!');
                    this.getUserRequests();
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    decelineUserRequest(request: any): void {
        const body = {
            id: request.id,
            userId: this.selectedUser.id,
            userRoleId: request.target_role_type_id
        }

        this.request.post(Constants.DECELINE_REQUEST, body)
            .subscribe({
                next: (response) => {
                    this.toaster.success('Request decelined!');
                    this.getUserRequests();
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    getTablesInformation(): void {

        this.request.get(Constants.GET_TABLES_INFORMATION, {})
            .subscribe({
                next: (response) => {
                    this.tablesInformation = response.tablesInfo;
                    console.warn('tablesInfo', response.tablesInfo);
                    console.warn('tablesInformation', this.tablesInformation);
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    setSqlWrapperVisibility(isVisible: boolean) {
        this.showSqlWrapper = isVisible;
    }

    selectTable(table: string) {
        this.currentSelectedTable = table
    }

    sendSqlQueryRequest() {

        console.warn('response.tablesInfo', this.sqlQuery);

        const lowerCaseQuery = this.sqlQuery.toLowerCase();
        if (lowerCaseQuery.includes('drop') ||
            lowerCaseQuery.toLowerCase().includes('alter') ||
            lowerCaseQuery.toLowerCase().includes('update') ||
            lowerCaseQuery.toLowerCase().includes('insert') ||
            lowerCaseQuery.toLowerCase().includes('delete') ||
            lowerCaseQuery.toLowerCase().includes('call')) {
            this.toaster.show('You are not allowed to change DB tables!');
            return;
        }

        this.request.get(Constants.GET_CUSTOM_SQL_QUERY_RESULT, { sqlQuery: this.sqlQuery })
            .subscribe({
                next: (response) => {
                    console.warn('response.sqlQueryResult', response.sqlQueryResult);
                    this.requestResultColumns = Object.keys(response.sqlQueryResult[0]);
                    this.requestResultData = response.sqlQueryResult;

                    this.requestResultExportLink = Constants.EXPORT_SQL_QUERY_RESULT + '?dbRequest=' + this.sqlQuery;
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    logOut(): void {
        this.router.navigate(['/authorization']);
    }

    setLogsVisibility(isVisible: boolean) {
        this.isLogsVisible = isVisible;

        if (this.isLogsVisible) {
            this.getDataBaseLogs();
            this.getLogsInterval = window.setInterval(() => this.getDataBaseLogs, 5000);
        }
        else {
            window.clearInterval(this.getLogsInterval);
        }
    }

    setBackupsVisibility(isVisible: boolean) {
        this.isBackupsVisible = isVisible;

        if (this.isBackupsVisible) {
            this.getDataBaseBackups();
        }
    }

    print() {
        const customPrintOptions: PrintOptions = new PrintOptions({
            printSectionId: 'print-section',
            printTitle: 'DB Data',
        });
        this.printService.print(customPrintOptions);
    }

    getDataBaseLogs(): void {

        this.request.get(Constants.GET_DB_JOURNAL, {})
            .subscribe({
                next: (response) => {
                    this.dataBaseLogs = response.result;
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    getDataBaseBackups(): void {

        this.request.get(Constants.GET_DATABASE_BACKUPS, {})
            .subscribe({
                next: (response) => {
                    this.dataBaseBackups = response.backups;
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    createDataBaseBackup(): void {
        this.request.get(Constants.CREATE_DATABASE_BACKUP, {})
            .subscribe({
                next: (response) => {
                    this.getDataBaseBackups();
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }
}