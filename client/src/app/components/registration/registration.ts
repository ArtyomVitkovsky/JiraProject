import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Request } from "src/app/services/request";
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
    selector: 'app_registration',
    templateUrl: './registration.html',
    styleUrls: ['./registration.css'],
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
export class Registation implements OnInit {
    email: string = '';
    password: string = '';
    firstName: string = '';
    lastName: string = '';
    project_name_text_overlay_opacity: boolean = true;
    project_name_text_blur: boolean = true;

    constructor(
        private request: Request,
        private toaster: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        window.setTimeout(() => {
            this.project_name_text_overlay_opacity = false;
            this.project_name_text_blur = false;
        }, 100);
    }

    createUser(): void {
        const body = {
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName
        }

        this.request.post(Constants.CREATE_USER, body)
            .subscribe({
                next: (response) => {
                    console.log(response);
                    this.toaster.success('User successfully created!');

                    this.router.navigate(['/board'])
                },
                error: (error) => {
                    console.log(error);
                    this.toaster.error(error.error.message);
                }
            })
    }

    toAthorization(): void {
        this.router.navigate(['/authorization']);
    }
}