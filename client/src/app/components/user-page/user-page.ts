import { Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Request } from "src/app/services/request";
import { AppStorage } from "src/app/services/appStorage";
import { Constants } from "src/app/utilities/constants";
import { Router } from "@angular/router";
import { timeout } from "rxjs";
import { IUserInfo } from "./IUserInfo";
import { IChangeRoleRequest } from "./IChangeRoleRequest";

@Component({
  selector: 'user-page',
  templateUrl: './user-page.html',
  styleUrls: ['./user-page.css'],
})


export class UserPage implements OnInit {

  currentUser: any;
  currentUserRole: string = "";

  userInfo: IUserInfo = {
    id: 'string',
    email: 'string',
    password: 'string',
    first_name: 'string',
    last_name: 'string',
    employee_state_type_id: 'string',
    employee_state_type: 'string',
    role_type_id: 'string',
    role_type: 'string'
  };

  changeRoleRequest: IChangeRoleRequest = {
    targetRoleTypeId: '',
    message: '',
    userId: ''
  }

  userRoles: any = [];
  userStates: any = [];

  userStateComboBox: any[] = []
  userRoleComboBox: any[] = []

  constructor(
    private request: Request,
    private appStorage: AppStorage,
    private toaster: ToastrService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.currentUser = this.appStorage.getUser();

    this.getUserRoles();
    this.getUserStates();

    this.getUserInfo();
  }

  getUserInfo() {
    const userId = this.currentUser.id;

    this.request.get(Constants.GET_USER_INFO, { userId })
      .subscribe({
        next: (response) => {
          this.userInfo = response.userInfo.find((userInfo: any) => userInfo.id = userId);

          this.userStateComboBox[0] = {
            label: "User State",
            items: this.userStates,
            comboBoxId: 'userStatesComboBox',
            inputId: 'userStatesInput',
            selectedOption: {
              id: this.userInfo.employee_state_type_id,
              name: this.userInfo.employee_state_type,
            }
          }
          this.userRoleComboBox[0] = {
            label: "Create Request to change User Role",
            items: this.userRoles,
            comboBoxId: 'userRolesComboBox',
            inputId: 'userRolesInput',
            selectedOption: {
              id: this.userInfo.role_type_id,
              name: this.userInfo.role_type,
            }
          }

          console.log(this.userInfo);
        },
        error: (error) => {
          console.log(error);
          this.toaster.error(error.error.message);
        }
      })
  }

  getUserRoles() {
    this.request.get(Constants.GET_USER_ROLES, {})
      .subscribe({
        next: (response) => {
          console.warn('GET_USER_ROLES', response);

          this.userRoles = [];

          response.userRoles.forEach((role: any) => {
            this.userRoles.push({
              id: role.id,
              name: role.role_type
            });
          });
        },
        error: (error) => {
          console.log(error);
          this.toaster.error(error.error.message);
        }
      })
  }

  getUserStates() {
    this.request.get(Constants.GET_USER_STATES, {})
      .subscribe({
        next: (response) => {

          response.userStates.forEach((state: any) => {
            this.userStates.push({
              id: state.id,
              name: state.employee_state_type
            });
          });
        },
        error: (error) => {
          console.log(error);
          this.toaster.error(error.error.message);
        }
      })
  }

  saveUserInfoChanges() {

    const body = {
      userId: this.currentUser.id,
      newEmail: this.userInfo.email,
      newPassword: this.userInfo.password,
      newFirstName: this.userInfo.first_name,
      newLastName: this.userInfo.last_name,
      newUserStateId: this.userStateComboBox[0].selectedOption.id,
    }

    console.warn('New UserInfo: ', body);

    this.request.post(Constants.SAVE_USER_INFO_CHANGES, body)
      .subscribe({
        next: (response) => {
          this.toaster.success('User info successfully updated!');
        },
        error: (error) => {
          console.log(error);
          this.toaster.error(error.error.message);
        }
      })
  }

  createChangeUserRoleRequest() {

    this.changeRoleRequest.targetRoleTypeId = this.userInfo.role_type_id;
    this.changeRoleRequest.userId = this.currentUser.id;

    const body = {
      targetRoleTypeId: this.changeRoleRequest.targetRoleTypeId,
      message: this.changeRoleRequest.message,
      userId: this.changeRoleRequest.userId
    }

    console.warn('Request', this.changeRoleRequest);

    this.request.post(Constants.CREATE_CHANGE_USER_ROLE_REQUEST, body)
      .subscribe({
        next: (response) => {
          this.toaster.success('Request successfully created!');
        },
        error: (error) => {
          console.log(error);
          this.toaster.error(error.error.message);
        }
      })
  }

  handleRoleComboboxOptionSelect(role_id: string): void {

    this.userInfo.role_type_id = role_id;
    this.userInfo.role_type = this.userRoles.find((role: any) => role.id === role_id).name;
  }

  handleStateComboboxOptionSelect(state_id: string): void {
    this.userInfo.employee_state_type_id = state_id;
    this.userInfo.employee_state_type = this.userStates.find((state: any) => state.id === state_id).name;
  }

  logOut() {
    this.router.navigate(['/authorization']);
  }
}