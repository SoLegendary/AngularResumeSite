import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Message } from '../../classes/message';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';


@Component
({
    selector: 'chatroom',
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.css'],
})



export class ChatroomComponent
{
    constructor(private http: Http) { }

    ngOnInit()
    {
        this.updateMessages();
    }

    url: string = 'http://solegendarytestapp.azurewebsites.net/dbQueryAngular.php';
    subscribeText: string = 'no current data'; // data from post request shown on page


    // Make a HTTP Post request to the PHP backend
    // url         - url to the backend script to be requested
    // query       - the string containing the query instruction
    // contentType - content-Type header to be sent (text, application/json, etc.)
    // callback    - callback function to execute after the subscribe data returns
    httpPost(url: string, query: string, contentType: string, callback?: Function)
    {
        let headers = new Headers();
        headers.append('Content-Type', contentType);
        let options = new RequestOptions({ headers: headers });

        this.http.post(url, query, options)
            .subscribe(
            (data) =>
            {
                console.log('Data from backend: ', data);
                this.subscribeText = data.text();
                if (callback)
                {
                    callback();
                }
                
            },
            (error) =>
            {
                console.log('Error: ', error);
                this.subscribeText = error.text();
                if (callback)
                {
                    callback();
                }
            })
    }


    username: string = 'Anonymous'; // username of person chatting
    updateUsername(username: string)
    {
        this.username = username;
    }


    // array of all messages ever sent in the chatroom
    messages: Message[];

    // update list of messages from the database and get highest message id
    updateMessages()
    {
        let querystring = "SELECT * FROM messages";
        this.httpPost(this.url, querystring, 'text',
            () => // following code must be sent as callback so it executes after the httpPost returns subscribe data
            {
                // substring to remove from the json string (ie. echoed PHP debug text)
                // IF PHP IS CHANGED THIS ALSO MUST CHANGE
                let debugstring: string = "Successfully performed query: '" + querystring + "'<br><br>"

                // remove debug text from the backend echoes
                let jsonstring = this.subscribeText.replace(debugstring, '');

                // turn string into a JSON object and assign it to visible messages
                console.log(jsonstring);
                this.messages = JSON.parse(jsonstring);
            }
        );
    }
    


    // deletes all messages from the database
    deleteMessages()
    {
        let querystring = "DELETE FROM messages";
        this.httpPost(this.url, querystring, 'text');
        this.messages = [];
    }



    // Build a message object and send it to the backend server
    submitMessage(messagebody: string)
    {
        let dt = new Date();
        let currentdate: string = dt.getDate().toString() + '-' + dt.getMonth().toString() + '-' + dt.getFullYear().toString();
        let currenttime: string = dt.getHours().toString() + ':' + dt.getMinutes().toString();

        // retrieve highest id number from the db to update
        // if this doesnt work, make lastid a component class variable and only update at the end of this function
        let lastid = 1;

        let message = <Message>
        ({
            username: (this.username || 'Anonymous'),
            id: lastid + 1,
            message: messagebody,
            date: currentdate,
            time: currenttime
        });

        let querystring = "INSERT INTO messages VALUES('" +
                           message.username + "', '" +
                           lastid           + "', '" +
                           message.message  + "', '" +
                           message.date     + "', '" +
                           message.time     + "')"

        this.httpPost(this.url, querystring, 'text', ()=>{this.updateMessages();});
    }
}