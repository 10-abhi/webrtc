import { useEffect, useRef, useState } from "react"

export const Receiver = () => {
   const videoRef = useRef<HTMLVideoElement>(null);

   const [pc, setPc] = useState<RTCPeerConnection | null>(null);
   useEffect(() => {
      const socket = new WebSocket('ws://localhost:8080');
      socket.onopen = () => {
         socket.send(JSON.stringify({ type: "receiver" }));
      }
      socket.onmessage = async (event) => {
         console.log("Received msg", event.data);
         const message = JSON.parse(event.data);
         if (message.type === "create-offer") {
            console.log("Matched create-offer");
            const newpc = new RTCPeerConnection();
            setPc(newpc);
            console.log("the peer conn", pc);
            await newpc?.setRemoteDescription(message.sdp);
            newpc.onicecandidate = (event) => {
               console.log("icecand event", event);
               if (event) {
                  socket.send(JSON.stringify({ type: 'iceCandidate', candidate: event.candidate }));
               }
            }

            newpc.ontrack = (event)=>{
               if(videoRef.current){
                  videoRef.current.srcObject = new MediaStream([event.track]); 
               }
            }

            const answer = await pc?.createAnswer();
            await pc?.setLocalDescription(answer);
            socket.send(JSON.stringify({ type: "create-answer", sdp: answer }));
         } else if (message.type === "iceCandidate") {
            await pc?.addIceCandidate(message.candidate);
         }
      }
   }, [])
   return <div>
      Receiver
      <video ref={videoRef}></video>
   </div>
}