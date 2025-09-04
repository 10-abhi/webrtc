//signaling server
import { WebSocketServer , WebSocket } from "ws";

const wss = new WebSocketServer({port : 8080});

let senderSocket : null | WebSocket = null;
let receiverSocket : null | WebSocket = null;

wss.on('connection' , function connection(ws){
    ws.on('error' , console.error);
    ws.on('message' , function message(data:any){
        const message = JSON.parse(data);
        //create offer 
        //create answer 
        //add ice candidate
        if(message.type === "sender"){
           senderSocket = ws;
           console.log("sender conn");
        }else if(message.type === 'receiver'){
           receiverSocket = ws;
           console.log("receiver conn");
        }else if (message.type === "create-offer"){
            console.log("inside createoffer");
            receiverSocket?.send(JSON.stringify({type : "create-offer" , sdp : message.sdp}));
        }else if(message.type === "create-answer"){
            console.log("inside createanswer");
            senderSocket?.send(JSON.stringify({type : "create-answer" , sdp : message.sdp}));
        }else if(message.type === 'icecandidate'){
            if(ws === senderSocket){
                console.log("inside icecand i.e sending to receiver")
                receiverSocket?.send(JSON.stringify({type:"iceCandidate" , candidate : message.candidate}));
            }else if(ws == receiverSocket){
                console.log("inside icecand i.e sending to sender")
                senderSocket?.send(JSON.stringify({type:"iceCandidate", candidate : message.candidate}))
            }
        }
    });
    ws.send('something');
});

