import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Request } from "src/app/services/request";
import { AppStorage } from "src/app/services/appStorage";
import { Constants } from "src/app/utilities/constants";
import { Router } from "@angular/router";


@Component({
    selector: 'user-projects',
    templateUrl: './user-projects.html',
    styleUrls: ['./user-projects.css'],
})
export class UserProjectsSelection implements OnInit {
    user: any;

    selectedProject: any;
    projectsComboboxOpened: boolean = false;
    projects: any[] =  [];

    allProjects: any[] = [];

    projectToSearch: string = '';

    constructor(
        private request: Request,
        private appStorage: AppStorage,
        private toaster: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.user = this.appStorage.getUser();
        this.getProjects();
    }

    getProjects(): void {

        try {
            const userId = this.user.id;
            this.request.get(Constants.GET_PROJECTS_FOR_EMPOLYEE, {userId: userId})
                .subscribe({
                    next: (response) => {
                        console.log(response);

                        response.projects.forEach((project: any) => {
                            this.projects.push({
                                id: project.id,
                                name: project.name,
                                projectManagerId: project.project_manager_id,
                                projectManagerEmail: project.email

                            });
                        });

                        console.log(this.projects);

                        this.allProjects = [...this.projects];
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

    selectProject(project: any): void {
        this.selectedProject = project;
        console.log('selectedProject', this.selectedProject);

        console.log(this.selectedProject);
        this.appStorage.saveSelectedProject(project);

        this.router.navigate(['board']);
    }     

    searchProjects(): void {

        if(this.projectToSearch){
            const result = this.allProjects.filter((project: any) =>
                project.name.toLowerCase().includes(this.projectToSearch.toLocaleLowerCase())
            );

            console.log(result)
            this.projects = result;
        }
        else {
            this.getProjects();
        }
    }

    openUserPage(): void {
        this.router.navigate(['/user-page']);
    }
}