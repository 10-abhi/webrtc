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

    const startSendingVideo = async()=>{
        if(!socket)return;
        const pc = new RTCPeerConnection();

        pc.onnegotiationneeded = async()=>{
        console.log("onnegotiation needed")
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.send(JSON.stringify({type : "create-offer" , sdp : offer}));
        }
        
        pc.onicecandidate = (event)=>{
          console.log(event);
          if(event.candidate){
            socket.send(JSON.stringify({type : "icecandidate" , candidate : event.candidate}))
          }
        }

        socket.onmessage = async(event)=>{
            const message = JSON.parse(event.data);
          if(message.type === "create-answer")
           await pc.setRemoteDescription(message.sdp);
          else if(message.type == "iceCandidate")
            await pc.addIceCandidate(message.candidate);
        }
        
        const getCameraStreamAndSend = (pc : RTCPeerConnection)=>{
          navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            //this should be propagated via a component but anyways
            document.body.appendChild(video);
            stream.getTracks().forEach((track)=>{
              pc?.addTrack(track);
            });
          });
        }
      getCameraStreamAndSend(pc);

    }
    return <div>
        Sender
        <button onClick={startSendingVideo}>Start Video</button>
    </div>
}