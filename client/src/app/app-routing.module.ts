import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Registation } from './components/registration/registration';
import { Authorization } from './components/authorization/authorization';
import { Board } from './components/board/board';
import { ProjectManagerMenu } from './components/project-manager-menu/project-manager-menu';
import { ProjectManagerMenuProjectCustomization } from './components/project-manager-menu/project-manager-menu-project-customization/project-manager-menu-project-customization';
import { AdminMenu } from './components/admin-menu/admin-menu';
import { UserProjectsSelection } from './components/user-projects/user-projects';
import { UserPage } from './components/user-page/user-page';

const routes: Routes = [
    {path: '', component: Registation},
    {path: 'registration', component: Registation},
    {path: 'authorization', component: Authorization},
    {path: 'project-manager-menu', component: ProjectManagerMenu},
    {path: 'project-manager-menu-project-customization', component: ProjectManagerMenuProjectCustomization},
    {path: 'admin-menu', component: AdminMenu},
    {path: 'board', component: Board},
    {path: 'user-projects', component: UserProjectsSelection},
    {path: 'user-page', component: UserPage}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
