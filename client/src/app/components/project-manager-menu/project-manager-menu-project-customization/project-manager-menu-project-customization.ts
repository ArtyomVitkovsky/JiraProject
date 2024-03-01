import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Request } from "src/app/services/request";
import { AppStorage } from "src/app/services/appStorage";
import { Constants } from "src/app/utilities/constants";
import { Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'project-manager-menu-project-customization',
  templateUrl: './project-manager-menu-project-customization.html',
  styleUrls: ['./project-manager-menu-project-customization.css'],
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

export class ProjectManagerMenuProjectCustomization implements OnInit {
  columnsCount: number = 2;
  columns: any[] = [
    { index: 0, name: 'Column 1...' },
  ];
  isCustomizationChanged = false;

  currentUser: any = {};

  isProjectCreation: boolean = false;
  newProjectName: string = '';

  selectedProject: any;
  projectsComboboxOpened: boolean = false;
  projects: any[] = [];

  isEmployeeToSelect: boolean = true;
  selectedEmployeeIndex: number = 0;
  employeesToSelect: any[] = []
  employeesOnProject: any[] = []

  employeesToInsert = new Set<string>();
  employeesToDelete = new Set<string>();

  constructor(
    private request: Request,
    private appStorage: AppStorage,
    private toaster: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.appStorage.getUser();

    this.getProjects();
  }

  getProjects(): void {

    try {
      this.request.get(Constants.GET_PROJECTS_FOR_PM, this.appStorage.getUser())
        .subscribe({
          next: (response) => {
            console.log(this.projects);
            response.projects.forEach((project: any) => {
              this.projects.push({
                id: project.id,
                name: project.name
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

      this.projects = [
        { index: '0', name: 'Project 1...' },
        { index: '1', name: 'Project 2...' },
      ]
    }
  }

  getEmployeesOnProject(): void {
    try {
      this.employeesOnProject = [];

      console.log(this.selectedProject);

      const projectId = this.selectedProject.id;

      this.request.get(Constants.GET_EMPLOYEES_ON_PROJECT, { projectId })
        .subscribe({
          next: (response) => {
            
            if(!response.employees || response.employees.length == 0) return;

            response.employees.forEach((employee: any) => {
              this.employeesOnProject.push({
                id: employee.id,
                first_name: employee.first_name,
                last_name: employee.last_name
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

      this.projects = [
        { index: '0', name: 'Project 1...' },
        { index: '1', name: 'Project 2...' },
      ]
    }
  }

  getEmployeesToSelect(): void {
    try {
      this.employeesToSelect = [];

      console.log(this.selectedProject);

      const projectId = this.selectedProject.id;

      this.request.get(Constants.GET_EMPLOYEES_TO_SELECT, { projectId })
        .subscribe({
          next: (response) => {
            
            if(!response.employees || response.employees.length == 0) return;

            response.employees.forEach((employee: any) => {
              this.employeesToSelect.push({
                id: employee.id,
                first_name: employee.first_name,
                last_name: employee.last_name
              })
            });

            console.log(this.employeesToSelect);

          },
          error: (error) => {
            console.log(error);
            this.toaster.error(error.error.message);
          }
        })
    }
    catch (error) {
      console.log(error);

      this.projects = [
        { index: '0', name: 'Project 1...' },
        { index: '1', name: 'Project 2...' },
      ]
    }
  }

  showCreateProjectContainer(): void {
    this.isProjectCreation = true;
  }

  createProject(): void {

    if (!this.newProjectName) {
      this.toaster.error('Project name can not be empty!');
      return;
    }

    const user = this.appStorage.getUser();

    const body = {
      name: this.newProjectName,
      projectManagerId: user.id
    };

    this.request.post(Constants.CREATE_PROJECT, body)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
          this.toaster.error(error.error.message);
        }
      })

    this.projects.push({
      name: this.newProjectName
    });

    this.newProjectName = '';
    this.isProjectCreation = false;

  }

  selectProject(project: any): void {
    const combobox = document.getElementById('combobox-selected-value');
    if (combobox === null) return;

    this.selectedProject = project;

    this.getEmployeesOnProject();
    this.getEmployeesToSelect();
    this.getColumnsConfig();
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

  addColumn(): void {
    this.columns.push({
      index: this.columnsCount,
      name: `Column ${this.columnsCount + 1}...`,
    });

    this.columnsCount++;

    window.setTimeout(() => {
      let content: any = document.getElementById('board-columns');

      content.scrollTo({
        left: content.scrollWidth - content.clientWidth,
        behavior: 'smooth'
      });
    }, 5);
  }

  removeColumn(index: number): void {

    if (this.columnsCount == 1) {
      this.toaster.error('At least one column should exist!');
      return;
    }

    this.columnsCount--;

    const id: any = this.columns.findIndex(column => column.index === index)
    this.columns.splice(id, 1);


    window.setTimeout(() => {
      let content: any = document.getElementById('board-columns');

      content.scrollTo({
        left: content.scrollWidth - content.clientWidth,
        behavior: 'smooth'
      });
    }, 5);
  }

  showDeleteButton(index: number): void {
    let content: any = document.getElementById(`trash_block_${index}`)

    let animation = content.animate([
      { opacity: 1 }
    ], 100)

    animation.addEventListener('finish', function () {
      content.style.opacity = 1;
    });
  }

  hideDeleteButton(index: number): void {
    let content: any = document.getElementById(`trash_block_${index}`)

    let animation = content.animate([
      { opacity: 0 }
    ], 100);

    animation.addEventListener('finish', function () {
      content.style.opacity = 0;
    });
  }

  saveProjectConfig(): void {
    try {

      const projectConfig: any = {};

      projectConfig.projectId = this.selectedProject.id;

      projectConfig.columnsConfig = JSON.stringify(this.columns);

      this.request.post(Constants.SAVE_PROJECTS, projectConfig)
        .subscribe({
          next: (response) => {

            this.toaster.success("project settings saved!");

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

  handleProjectsListDisplaying(): void {
    this.projectsComboboxOpened = !this.projectsComboboxOpened;

    const projectsComboBox = document.getElementById('projects-list');
    if (this.projectsComboboxOpened) {
      projectsComboBox?.classList.add('slds-is-open');
    } else {
      projectsComboBox?.classList.remove('slds-is-open');
    }
  }

  handleProjectsComboBoxFocusOut(): void {
    window.setTimeout(() => {
      const projectsComboBox = document.getElementById('projects-list');
      projectsComboBox?.classList.remove('slds-is-open');
      this.projectsComboboxOpened = false;
    }, 100);

  }

  selectEmployee(index: number, isToSelect: boolean): void {
    this.selectedEmployeeIndex = index;
    this.isEmployeeToSelect = isToSelect;

    console.log(`is employee ${index} to select ${isToSelect}`);

  }

  addEmployeeToProject(): void {
    if (!this.isEmployeeToSelect) return;

    const employee = this.employeesToSelect[this.selectedEmployeeIndex];

    if (!employee) return;

    console.log(`employee to add ${employee}`);

    this.employeesOnProject.push(employee);

    this.employeesToSelect.splice(this.selectedEmployeeIndex, 1);

    this.employeesToInsert.add(employee.id);
    this.employeesToDelete.delete(employee.id);

    this.requestAddEmployeeToProject(this.selectedProject.id, employee.id);
  }

  requestAddEmployeeToProject(projectId: string, employeeId: string) {
    try {
      const body = {
        projectId: projectId,
        employeeId: employeeId
      };

      this.request.post(Constants.CREATE_PROJECT_EMPLOYEE_RELATION, body).subscribe({})
    }
    catch (error) {
      console.log(error);
    }
  }

  removeEmployeeFromProject(): void {
    if (this.isEmployeeToSelect) return;

    const employee = this.employeesOnProject[this.selectedEmployeeIndex];

    if (!employee) return;

    console.log(`employee to remove ${employee}`);

    this.employeesToSelect.push(employee);

    this.employeesOnProject.splice(this.selectedEmployeeIndex, 1);

    this.employeesToDelete.add(employee.id);
    this.employeesToInsert.delete(employee.id);

    this.requestRemoveEmployeeFromProject(this.selectedProject.id, employee.id);
  }

  requestRemoveEmployeeFromProject(projectId: string, employeeId: string) {
    try {
      const body = {
        projectId: projectId,
        employeeId: employeeId
      };

      this.request.post(Constants.REMOVE_PROJECT_EMPLOYEE_RELATION, body).subscribe({})
    }
    catch (error) {
      console.log(error);
    }
  }

  logOut(): void {
    this.router.navigate(['/authorization']);
}
}