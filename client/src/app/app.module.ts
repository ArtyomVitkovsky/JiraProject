import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { Request } from './services/request';
import { AppStorage } from './services/appStorage';

import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { Registation } from './components/registration/registration';
import { Authorization } from './components/authorization/authorization';
import { Board } from './components/board/board';
import { ProjectManagerMenu } from './components/project-manager-menu/project-manager-menu';
import { AdminMenu } from './components/admin-menu/admin-menu';
import { UserProjectsSelection } from './components/user-projects/user-projects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProjectManagerMenuProjectCustomization } from './components/project-manager-menu/project-manager-menu-project-customization/project-manager-menu-project-customization';
import { UserPage }  from "./components/user-page/user-page";

import { NgxPrintModule } from 'ngx-print';

import { Combobox }  from "./ui/combobox/combobox.component";

@NgModule({
	declarations: [
		AppComponent,
		Registation,
		Authorization,
		ProjectManagerMenu,
		ProjectManagerMenuProjectCustomization,
		AdminMenu,
		Board,
		UserProjectsSelection,
		UserPage,
		Combobox
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		BrowserAnimationsModule,
		FontAwesomeModule,
		NgxPrintModule
	],
	providers: [
		Request,
		AppStorage,
		provideAnimations(),
		provideToastr()
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
