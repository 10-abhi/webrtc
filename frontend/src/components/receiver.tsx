import { useEffect } from "react"

export const Receiver = ()=>{
    useEffect(()=>{
     const socket = new WebSocket('ws://localhost:8080');
     socket.onopen = ()=>{
        socket.send(JSON.stringify({type : "receiver"}));
     }
     socket.onmessage = async (event)=>{
      console.log("Received msg", event.data);
        const message = JSON.parse(event.data);
        if(message.type === "create-offer"){
           console.log("Matched create-offer");
           const pc = new RTCPeerConnection();
           pc.setRemoteDescription(message.sdp);
           const answer =await pc.createAnswer();
           pc.setLocalDescription(answer);
           socket.send(JSON.stringify({type : "create-answer" , sdp : answer}));
        }
     }
    }, [])
    return <div>
      Receiver
    </div>
}