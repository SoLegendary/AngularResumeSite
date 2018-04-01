import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { transition, trigger, query, style, state, animate, group, animateChild, stagger } from '@angular/animations';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component
({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],

    animations:
    [
        trigger('animRoutes',
        [
            transition('1 => *, 2 => 3, 2 => 4, 2 => 5, 3 => 4, 3 => 5, 4 => 5',
            [
                // starting transform for the entering element
                query(':enter', style({ transform: 'translateX(20%)', opacity: 0 })),
                // starting transform for both elements are positioned to allow transforms
                query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
                
                group
                ([
                    // ending transform for leaving element
                    query(':leave',
                        animate('0.3s cubic-bezier(.35,0,.25,1)',
                        style({ transform: 'translateX(-20%)', opacity: 0 }))),
                    // ending transform for entering element
                    query(':enter',
                        animate('0.3s cubic-bezier(.35,0,.25,1)',
                        style({ transform: 'translateX(0)', opacity: 1 }))),
                ]),
            ]),

            transition('5 => *, 4 => 3, 4 => 2, 4 => 1, 3 => 2, 3 => 1, 2 => 1',
            [
                query(':enter', style({ transform: 'translateX(-20%)', opacity: 0 })),
                query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
                
                group
                ([
                    query(':leave',
                        animate('0.3s cubic-bezier(.35,0,.25,1)',
                        style({ transform: 'translateX(20%)',  opacity: 0 }))),
                    
                    query(':enter',
                        animate('0.3s cubic-bezier(.35,0,.25,1)',
                        style({ transform: 'translateX(0)', opacity: 1 }))),
                ]),
            ]),
        ])
    ]
})




export class AppComponent
{
    constructor() { }

    getPage(outlet: any)
    {
        return outlet.activatedRouteData['page'];
    }
}

