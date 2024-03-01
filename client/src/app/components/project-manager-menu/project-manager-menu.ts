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
  selector: 'project-manager-menu',
  templateUrl: './project-manager-menu.html',
  styleUrls: ['./project-manager-menu.css'],
})

export class ProjectManagerMenu implements OnInit {

  constructor(
    private request: Request,
    private appStorage: AppStorage,
    private toaster: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toProjectCustomization(): void {
    this.router.navigate(['/project-manager-menu-project-customization']);
  }

  toBoard(): void {
    this.router.navigate(['/user-projects']);
  }
}