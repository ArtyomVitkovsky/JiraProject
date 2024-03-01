import { Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Request } from "src/app/services/request";
import { AppStorage } from "src/app/services/appStorage";
import { Constants } from "src/app/utilities/constants";
import { Router } from "@angular/router";
import { ITask } from "./ITask";
import { ITaskCard } from "./ITaskCard";
import { timeout } from "rxjs";

@Component({
    selector: 'board',
    templateUrl: './board.html',
    styleUrls: ['./board.css'],
})
export class Board implements OnInit {
    currentUser: any;
    currentUserRole: string = "";

    selectedProject: any;
    projectsComboboxOpened: boolean = false;
    employeesOnProject: any[] = []

    currentTaskEmployee: any = {
        id: '',
        name: ''
    };

    columnsCount: number = 2;
    columns: any[] = [
        { id: '0', name: 'Column 1...' },
        { id: '1', name: 'Column 2...' },
    ];
    allTasks: ITask[] = [];

    taskCards: ITaskCard[] = [];

    taskTypes: any = [];
    currentTaskType: any = {};

    draggedTask: ITask = {
        id: 'string',
        project_id: 'string',
        task_name: 'string',
        task_description: 'string',
        employee_id: 'string',
        permformer_first_name: 'string',
        permformer_last_name: 'string',
        pm_email: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        column_index: 0,
        task_type_id: 'string',
        task_type: 'string',
        estimated_hours: 8,
        logged_hours: 0
    };

    selectedTask: ITask = {
        id: 'string',
        project_id: 'string',
        task_name: 'string',
        task_description: 'string',
        employee_id: 'string',
        permformer_first_name: 'string',
        permformer_last_name: 'string',
        pm_email: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        column_index: 0,
        task_type_id: 'string',
        task_type: 'string',
        estimated_hours: 8,
        logged_hours: 0
    };

    comboBoxes: any[] = []

    isTaskSelected: boolean = false;

    tasksByColumns: any = {};

    //flter fields
    taskName: string = "";
    selectedUser: any;

    constructor(
        private request: Request,
        private appStorage: AppStorage,
        private toaster: ToastrService,
        private router: Router
    ) { }

    async ngOnInit() {
        this.selectedProject = this.appStorage.getSelectedProject();
        this.currentUser = this.appStorage.getUser();

        this.getUserRole();

        this.getColumnsConfig();
        this.getTasks();
        this.getBoardView();
        this.getTaskTypes();
        this.getEmployeesOnProject();

        window.setTimeout(() => {
            this.comboBoxes = [
                {
                    label: "Performer",
                    items: this.employeesOnProject,
                    comboBoxId: 'employeesComboBox',
                    inputId: 'employeesInput',
                    selectedOption: {
                        name: this.currentTaskEmployee.name,
                        id: this.currentTaskEmployee.id
                    }
                },
                {
                    label: "Task Type",
                    items: this.taskTypes,
                    comboBoxId: 'taskTypesComboBox',
                    inputId: 'taskTypesInput',
                    selectedOption: {
                        name: this.currentTaskType.name,
                        id: this.currentTaskType.id
                    }
                }]
        }, 100);

        console.warn('selectedProject', this.selectedProject);
    }

    getProgress(taskId: string): number {
        const task = this.allTasks.find((task: any) => task.id == taskId);

        if (!task) return 0;

        const result =
            task.estimated_hours === 0
                ? 0
                : task.logged_hours / task.estimated_hours * 100;

        return result;
    }


    getOvertime(taskId: string): number {
        const task = this.allTasks.find((task: any) => task.id == taskId);

        if (!task) return 0;

        const overtimeDiff = task.logged_hours - task.estimated_hours;

        const result =
            overtimeDiff <= 0
                ? 0
                : overtimeDiff / task.estimated_hours * 100;

        return result;
    }

    getLoggedTimeFormatted(): string {
        let result = '';
        const totalHours = this.selectedTask.logged_hours;

        const years = this.selectedTask.logged_hours / 8;


        return result;
    }

    handleOptionSelect(option: string): void {

        this.trySelectTaskPerformer(option);
        this.trySelectTaskType(option);
    }

    trySelectTaskPerformer(id: string): void {
        const employee = this.employeesOnProject.find((employee: any) => employee.id === id);

        if (!employee) return;

        console.warn('Selected new Task Performer', employee);

        this.currentTaskEmployee = employee;

        this.selectedTask.employee_id = this.currentTaskEmployee.id;
    }

    trySelectTaskType(id: string): void {
        const taskType = this.taskTypes.find((taskType: any) => taskType.id === id);

        if (!taskType) return;

        console.warn('Selected new Task Type', taskType);

        this.currentTaskType = taskType;

        this.selectedTask.task_type_id = this.currentTaskType.id;
    }

    getEmployeesOnProject(): void {
        try {
            this.employeesOnProject = [];

            console.log(this.selectedProject);

            const projectId = this.selectedProject.id;

            this.request.get(Constants.GET_EMPLOYEES_ON_PROJECT, { projectId })
                .subscribe({
                    next: (response) => {

                        if (!response.employees || response.employees.length == 0) return;

                        response.employees.forEach((employee: any) => {
                            this.employeesOnProject.push({
                                id: employee.id,
                                name: employee.first_name + ' ' + employee.last_name
                            })
                        });

                        console.log(this.employeesOnProject);
                    },
                    error: (error) => {
                        console.log(error);
                        this.toaster.error(error.error.message);
                    }
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    getUserRole(): void {
        try {
            const projectId = this.selectedProject.id;
            console.log(projectId);
            this.request.get(Constants.GET_USER_ROLE, { userRoleId: this.currentUser.user_role_id })
                .subscribe({
                    next: (response) => {
                        this.currentUserRole = response.userRole.role_type;
                    },
                    error: (error) => {
                        console.log(error);
                        this.toaster.error(error.error.message);
                    }
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    getColumnsConfig(): void {
        try {

            const projectId = this.selectedProject.id;
            console.log(projectId);
            console.log('this.selectedProject', this.selectedProject);

            this.request.get(Constants.GET_COLUMNS_CONFIG, { projectId: projectId })
                .subscribe({
                    next: (response) => {
                        this.columns = [];

                        const columnsConfigs = JSON.parse(response.columnsConfig);
                        columnsConfigs.forEach((columnsConfig: any) => {
                            this.columns.push({
                                index: columnsConfig.index,
                                name: columnsConfig.name
                            })
                        });
                    },
                    error: (error) => {
                        console.log(error);
                        this.toaster.error(error.error.message);
                    }
                })
        }
        catch (error) {
            console.log(error);

            this.columns = [
                { index: 0, name: 'Column 1...' },
                { index: 1, name: 'Column 2...' },
            ]
        }
    }

    onTaskDragStart(task_id: string) {
        const task = this.allTasks.find((task) => task.id === task_id);

        if (!task) return;

        this.draggedTask = task;
    }

    onTaskDrop(event: any, columnIndex: number) {

        if (!this.draggedTask) return;

        this.updateTaskColumnIndex(columnIndex);
    }

    onDragOver(event: any) {
        event.preventDefault();
    }

    updateTaskColumnIndex(columnIndex: number) {
        const body = {
            taskId: this.draggedTask.id,
            columnIndex: columnIndex
        }

        console.warn('updateTaskColumnIndex.body', body);

        this.request.post(Constants.UPDATE_TASK_COLUMN_INDEX, body)
            .subscribe({
                next: (response) => {
                    this.getTasks();
                    this.getBoardView();
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    getTasks(): void {
        try {
            var projectId = this.selectedProject.id;
            console.log(projectId);
            this.allTasks = [];

            this.request.get(Constants.GET_TASKS, { projectId: projectId })
                .subscribe({
                    next: (response) => {
                        response.tasks.forEach((task: any) => {
                            this.allTasks.push({
                                id: task.id,
                                project_id: task.project_id,
                                task_name: task.task_name,
                                task_description: task.task_description,
                                employee_id: task.employee_id,
                                permformer_first_name: task.permformer_first_name,
                                permformer_last_name: task.permformer_last_name,
                                pm_email: task.pm_email,
                                createdAt: task.createdAt,
                                updatedAt: task.updatedAt,
                                column_index: task.column_index,
                                task_type_id: task.task_type_id,
                                task_type: task.task_type,
                                estimated_hours: task.estimated_hours,
                                logged_hours: task.logged_hours,
                            });
                        });

                        console.warn('TASKS', this.allTasks);
                    },
                    error: (error) => {
                        console.log(error);
                        this.toaster.error(error.error.message);
                    }
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    getBoardView(): void {
        try {
            var projectId = this.selectedProject.id;
            console.log(projectId);
            this.allTasks = [];

            this.taskCards = [];
            this.tasksByColumns = {};

            this.request.get(Constants.GET_BOARD_VIEW, { projectId: projectId })
                .subscribe({
                    next: (response) => {
                        response.boardView.forEach((task: any) => {
                            this.taskCards.push({
                                id: task.id,
                                task_name: task.task_name,
                                permformer_first_name: task.permformer_first_name,
                                permformer_last_name: task.permformer_last_name,
                                task_type: task.task_type,
                                column_index: task.column_index
                            });
                        });

                        this.tasksByColumns = response.boardView.reduce((tasksByColumns: any, task: any) => {
                            if (!tasksByColumns[task.column_index]) {
                                tasksByColumns[task.column_index] = [];
                            }

                            tasksByColumns[task.column_index].push({
                                id: task.id,
                                task_name: task.task_name,
                                permformer_first_name: task.permformer_first_name,
                                permformer_last_name: task.permformer_last_name,
                                task_type: task.task_type,
                                column_index: task.column_index
                            });

                            return tasksByColumns;
                        }, {});

                        console.warn('BOARD VIEW', this.taskCards);
                        console.warn('TASKS BY COLUMNS', this.tasksByColumns);
                    },
                    error: (error) => {
                        console.log(error);
                        this.toaster.error(error.error.message);
                    }
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    getTaskTypes(): void {
        try {

            this.request.get(Constants.GET_TASK_TYPES, {})
                .subscribe({
                    next: (response) => {
                        console.log(response)
                        this.taskTypes = response.taskTypes.map((type: any) => ({
                            id: type.id,
                            name: type.task_type
                        }));
                    },
                    error: (error) => {
                        console.log(error);
                        this.toaster.error(error.error.message);
                    }
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    selectTask(id: string): void {
        const task = this.allTasks.find((task) => task.id === id);
        const taskCard = this.taskCards.find((task) => task.id === id);

        if (task == null) return;

        this.selectedTask = task;
        this.isTaskSelected = true;

        this.currentTaskType = {
            id: task.task_type_id,
            name: task.task_type
        };

        this.currentTaskEmployee = {
            id: task.employee_id,
            name: taskCard?.permformer_first_name + ' ' + taskCard?.permformer_last_name
        };

        this.comboBoxes[0].selectedOption = {
            name: this.currentTaskEmployee.name,
            id: this.currentTaskEmployee.id
        }

        this.comboBoxes[1].selectedOption = {
            name: this.currentTaskType.name,
            id: this.currentTaskType.id
        }
    }

    saveTaskChanges(taskId: string): void {
        const body = {
            task: this.selectedTask
        }

        console.warn('Try to save task changes', this.selectedTask);

        this.request.post(Constants.SAVE_TASK_CHANGES, body)
            .subscribe({
                next: (response) => {
                    this.toaster.success('Task successfully changed!');
                    this.getTasks();
                    this.getBoardView();
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    closeTaskModal(): void {
        this.isTaskSelected = false;
    }

    createTask(columnIndex: number): void {

        const body = {
            projectId: this.selectedProject.id,
            projectManagerId: this.selectedProject.projectManagerId,
            columnIndex: columnIndex
        }

        console.warn('createTask.body', body);

        this.request.post(Constants.CREATE_TASK, body)
            .subscribe({
                next: (response) => {
                    this.toaster.success('Task successfully created!');
                    this.getTasks();
                    this.getBoardView();
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    openUserPage(): void {
        this.router.navigate(['/user-page']);
    }
}