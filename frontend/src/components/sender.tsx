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
        await pc.setLocalDescription(offer);
        socket.send(JSON.stringify({type : "create-offer" , sdp : offer}));
        socket.onmessage = async(event)=>{
            const message = JSON.parse(event.data);
          if(message.type === "create-answer")
           await pc.setRemoteDescription(message.sdp);
          else if(message.type == "iceCandidate")
            await pc.addIceCandidate(message.candidate);
        }
    }
    return <div>
        Sender
        <button onClick={startSendingVideo}>Start Video</button>
    </div>
}