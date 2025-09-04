import { useEffect } from "react"

export const Receiver = () => {

   useEffect(() => {
      const socket = new WebSocket('ws://localhost:8080');
      socket.onopen = () => {
         socket.send(JSON.stringify({ type: "receiver" }));
         startReceiving(socket);
      }
   }, []);

   function startReceiving(socket: WebSocket) {
      const video = document.createElement('video');
      document.body.appendChild(video);

      const newpc = new RTCPeerConnection();
      newpc.ontrack = (event)=>{
         video.srcObject = new MediaStream([event.track]);
         video.play();
      }

      if (!socket) return
      socket.onmessage = async (event) => {
         console.log("Received msg", event.data);
         const message = JSON.parse(event.data);
         if (message.type === "create-offer") {
            console.log("Matched create-offer");
            await newpc?.setRemoteDescription(message.sdp);
            const answer = await newpc?.createAnswer();
            await newpc?.setLocalDescription(answer);
            socket.send(JSON.stringify({ type: "create-answer", sdp: answer }));
         } else if (message.type === "iceCandidate") {
            await newpc?.addIceCandidate(message.candidate);
         }
      }
      newpc.onicecandidate = (event) => {
         console.log("icecand event sending ice cand from receiver to server in frontend", event);
         if (event.candidate) {
            socket.send(JSON.stringify({ type: 'iceCandidate', candidate: event.candidate }));
         }
      }

   }

return <div>
   Receiver
</div>
}