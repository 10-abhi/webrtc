import { useEffect } from "react"
import { useState } from "react";

export const Sender = ()=>{
    const [socket , setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
      const socket = new WebSocket('ws://localhost:8080');
      socket.onopen = ()=>{
        socket.send(JSON.stringify({type : "sender"}));
        setSocket(socket);
      }
    } , []);

    async function startSendingVideo(){
        if(!socket)return;
        const pc = new RTCPeerConnection();
        const offer = await pc.createOffer();
        pc.setLocalDescription(offer);
        socket.send(JSON.stringify({type : "create-offer" , sdp : offer}));
        socket.onmessage = (event)=>{
            const message = JSON.parse(event.data);
            pc.setRemoteDescription(message.sdp);
        }
    }
    return <div>
        Sender
        <button onClick={startSendingVideo}>Start Video</button>
    </div>
}