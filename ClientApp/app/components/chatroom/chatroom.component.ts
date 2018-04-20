import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Message } from '../../classes/message';
import { Observable } from 'rxjs/Rx';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';


@Component
({
    selector: 'chatroom',
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.css'],
})

// TODO:
/*
 * Account/login service - adapt from testapp project 2/3
 * Dynamic update calls instead of polling every second
 * Message loading/shifting animation
 * Dynamically sized message boxes
 * Allow use of enter to send messages (maybe change to form instead of textarea + button)
 * Message send/receive sounds when window not in focus
 * 
 * BUGS:
 * 
 * ' character breaks SQL syntax
 * Long messages are not wrapping around the box edges
 * 
 */


export class ChatroomComponent
{
    constructor(private http: Http) { }

    url: string = 'http://solegendarytestapp.azurewebsites.net/dbQueryAngular.php';
    subscribeText: string = ''; // data from post request shown on page

    ngOnInit()
    {
        this.updateMessages();

        // Repeat updateMessage() every second
        // ALTERNATIVELY find a way to trigger a global update for all clients when anyone sends a message?
        // Somehow send a message from backend to frontend whenever a submit message is done

        Observable.interval(1000)
            .subscribe
            (x =>
            {
                this.updateMessages();
            });
    }


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
                console.log('Error from backend: ', error);
                this.subscribeText = error.text();
                if (callback)
                {
                    callback();
                }
            })
    }


    showDebug: boolean = false;
    toggleDebug()
    {
        this.showDebug = !this.showDebug;
    }

    username: string = 'Anonymous'; // username of person chatting
    updateUsername(username: string)
    {
        this.username = username;
    }


    // array of all messages ever sent in the chatroom
    messages: Message[];
    lastid: number = 0;

    // update list of messages from the database and get highest message id
    updateMessages()
    {
        let querystring = "SELECT TOP 5 * FROM messages ORDER BY id DESC";
        //let querystring = 'SELECT * FROM messages WHERE id > (SELECT (MAX(id) - 5) FROM messages)';
        
        this.httpPost(this.url, querystring, 'text',
            () =>
            {
                // substring to remove from the json string (ie. echoed PHP debug text)
                // IF PHP IS CHANGED THIS ALSO MUST CHANGE
                let debugstring: string = "Successfully performed query: '" + querystring + "'<br><br>"

                // if (response was received && response is successful && data exists)
                if (this.subscribeText && this.subscribeText.includes(debugstring) && !this.subscribeText.includes("No data retrieved"))
                {
                    // remove debugstring from the subscribeText echoed from backend
                    let jsonstring = this.subscribeText.replace(debugstring, '');
                    
                    // turn string into a JSON object and assign it to visible messages
                    console.log(jsonstring);
                    this.messages = JSON.parse(jsonstring).reverse();

                    this.lastid = this.messages[this.messages.length - 1].id;
                }
            }
        );
    }
    


    // deletes all messages from the database
    deleteMessages()
    {
        let querystring = "DELETE FROM messages";
        this.httpPost(this.url, querystring, 'text',
            () =>
            {
                this.messages = [];
            }
        );
    }



    // Build a message object and send it to the backend server
    submitMessage(messagebody: string)
    {
        let dt = new Date();
        let currentdate: string = dt.getDate().toString() + '-' + dt.getMonth().toString() + '-' + dt.getFullYear().toString();
        let currenttime: string = dt.getHours().toString() + ':' + dt.getMinutes().toString();

        // retrieve highest id number from the db to update
        // if this doesnt work, make lastid a component class variable and only update at the end of this function

        let message = <Message>
        ({
            username: (this.username || 'Anonymous'),
            id: this.lastid + 1,
            message: messagebody,
            date: currentdate,
            time: currenttime
        });

        let querystring = "INSERT INTO messages VALUES('" +
                           message.username + "', '" +
                           message.id       + "', '" +
                           message.message  + "', '" +
                           message.date     + "', '" +
                           message.time     + "')"

        this.httpPost(this.url, querystring, 'text', ()=>{ this.updateMessages() });
    }
}