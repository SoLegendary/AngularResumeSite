import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Message } from '../../classes/message';


@Component
({
    selector: 'chatroom',
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.css'],
})



export class ChatroomComponent
{
    constructor(private http: Http) { }

    // array of all messages ever sent in the chatroom
    messages: Message[];
    

    url: string = 'http://solegendarytestapp.azurewebsites.net/dbQueryHttp.php';
    teststring: string = "INSERT INTO messages VALUES ('janedoe123', '1', 'goodbye world!', '2018-04-01', '12:10:10')";
    subscribeText: string = 'no current data'; // data from post request shown on page

    // Make a HTTP Post request to the PHP backend
    // url         - url to the backend script to be requested
    // query       - the string containing the query instruction
    // contentType - Content-Type header to be sent (text, application/json, etc.)
    httpPost(url: string, query: string, contentType: string)
    {
        let headers = new Headers();
        headers.append('Content-Type', contentType);
        let options = new RequestOptions({ headers: headers });

        this.http.post(url, query, options)
            .subscribe(
            (data) =>
            {
                console.log('Got some data from backend: ', data);
                this.subscribeText = data.text();
            },
            (error) =>
            {
                console.log('Error: ', error);
                this.subscribeText = error.text();
            })
    }
}