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
    selector: 'app_authorization',
    templateUrl: './authorization.html',
    styleUrls: ['./authorization.css'],
    animations: [
        trigger('project_name_text_overlay_opacity', [
            state('true', style({ opacity: '1', background: 'white' })),
            state('false', style({ opacity: '0.1', background: 'white' })),
            transition('0 <=> 1', animate('5000ms cubic-bezier(.13,.78,.59,1.03)'))
        ]),
        trigger('project_name_text_blur', [
            state('true', style({ filter: 'blur(10rem)' })),
            state('false', style({ filter: 'blur(0.75rem)' })),
            transition('0 <=> 1', animate('5000ms cubic-bezier(.13,.78,.59,1.03)'))
        ])
    ]
})
export class Authorization implements OnInit {
    email: string = '';
    password: string = '';
    project_name_text_overlay_opacity: boolean = true;
    project_name_text_blur: boolean = true;

    constructor(
        private request: Request,
        private appStorage: AppStorage,
        private toaster: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        window.setTimeout(() => {
            this.project_name_text_overlay_opacity = false;
            this.project_name_text_blur = false;
        }, 100);
    }

    authorize(): void {
        const body = {
            email: this.email,
            password: this.password
        }

        this.request.get(Constants.AUTHORIZE, body)
            .subscribe({
                next: (response) => {
                    this.appStorage.saveUser(response.body.user);
                    this.toaster.success('Authorization successfully!');

                    console.log(response.body.userRole.role_type);
                    this.navigateToUserWorkspace(response.body.userRole.role_type);
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })        
    }

    navigateToUserWorkspace(userRole: any){
        
        let page = '';
        if(userRole === 'Employee') page = '/user-projects';
        if(userRole === 'Project Manager') page = '/project-manager-menu';
        if(userRole === 'Admin') page = '/admin-menu';

        this.router.navigate([page]);
    }

    toRegistration(): void {
        this.router.navigate(['/registration']);
    }
}