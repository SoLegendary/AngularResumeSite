import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app/app.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { EducationComponent } from './components/education/education.component';
import { EmploymentComponent } from './components/employment/employment.component';
import { OtherComponent } from './components/other/other.component';

const routes =
[
    { path: '', redirectTo: 'about', pathMatch: 'full' },
    { path: 'about', component: AboutComponent, data: { page: 1 } },
    { path: 'skills', component: SkillsComponent, data: { page: 2 } },
    { path: 'education', component: EducationComponent, data: { page: 3 } },
    { path: 'employment', component: EmploymentComponent, data: { page: 4 } },
    { path: 'other', component: OtherComponent, data: { page: 5 } },
    { path: '**', redirectTo: 'about' }
]

@NgModule
({
    declarations: // components
    [
        AppComponent,
        AboutComponent,
        SkillsComponent,
        EducationComponent,
        EmploymentComponent,
        OtherComponent
    ],

    imports: // modules
    [
        CommonModule,
        FormsModule,
        RouterModule.forRoot(routes),
        BrowserModule,
        BrowserAnimationsModule
    ],

    exports:
    [
        RouterModule
    ],

    providers: // services
    [

    ]
})



export class AppModuleShared
{

}