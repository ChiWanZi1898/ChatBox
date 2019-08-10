import React, {Component} from 'react';
import axios from 'axios';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

// function subscribeToTimer(cb) {
//     socket.on('timer', timestamp => cb(null, timestamp));
//     socket.emit('subscribeToTimer', 1000);
// }

function send() {
    socket.emit('send', 'hahaha');
}

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: ['hahaha', 'hahdfadsf'],
            timestamp: 'no timestamp yet'
        };

        const document = this;
        socket.on('broadcast', message => {
            document.setState({
                messages: [...document.state.messages, message]
            })
        });

        // this.updateMessage = this.updateMessage.bind(this);

    }

    // componentDidMount() {
    //     const {messages, eventSource} = this.state;
    //     eventSource.addEventListener('message', message => {
    //
    //         this.setState({
    //             messages: messages.concat([message.data])
    //         });
    //
    //     });
    //         // this.updateMessage(e.data);
    // }

    // updateMessage(message) {
    //     console.log('up');
    //     // let newData = this.state.data.map(item => {
    //     //     if (item.flight === flightState.flight) {
    //     //         item.state = flightState.state;
    //     //     }
    //     //     return item;
    //     // });
    //
    //     console.log(message);
    // }

    // componentDidMount() {
    //     this.interval = setInterval(this.updateMessage, 1000);
    //     this.updateMessage();
    // }

    // componentWillUnmount() {
    //     // clearInterval(this.interval);
    //     this.eventSource.close();
    // }


    // updateMessage() {
    //     axios.get('/api/messages')
    //         .then(response => {
    //             const newMessages = response.data.messages.map(message => {
    //                 return message.message
    //             });
    //             this.setState({
    //                 messages: this.state.messages.concat(newMessages)
    //             })
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }





    render() {
        return (
            <div>
                <ul>
                    {this.state.messages.map((message, idx) => {
                        return <li key={idx}>{message}</li>;
                    })}
                </ul>
                <button onClick={send}>Send</button>
            </div>


        )

        // return (
        //     <p>
        //         This is {this.state.timestamp}
        //     </p>
        // )
    }
}

export default Messages