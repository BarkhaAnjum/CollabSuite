import React, { useRef, useState } from 'react';

const VideoConference = ({ onlineUsers }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [connected, setConnected] = useState(false);

  // Start the camera + mic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      alert('Camera & mic enabled. Now choose Caller or Receiver.');
    } catch (err) {
      console.error(err);
      alert('Could not access camera/mic. Check permissions.');
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // public STUN
      ],
    });

    // When we get remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // When ICE gathering is done, localDescription will contain all candidates
    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        const sdp = JSON.stringify(pc.localDescription);
        // Show SDP to user to copy
        window.prompt(
          'Send this SDP to the other person (copy all):',
          sdp
        );
      }
    };

    // Add our local tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    peerConnectionRef.current = pc;
    return pc;
  };

  // Person A (Caller)
  const handleCreateOffer = async () => {
    if (!localStream) {
      alert('Start camera first.');
      return;
    }

    const pc = createPeerConnection();

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      alert('Offer created. Copy the SDP from the next prompt and send it to the other person.');
    } catch (err) {
      console.error(err);
      alert('Failed to create offer.');
    }
  };

  // Person B (Receiver)
  const handleAcceptOfferCreateAnswer = async () => {
    if (!localStream) {
      alert('Start camera first.');
      return;
    }

    const offerString = window.prompt('Paste the SDP offer you received:');
    if (!offerString) return;

    let offer;
    try {
      offer = JSON.parse(offerString);
    } catch (err) {
      alert('Invalid offer JSON.');
      return;
    }

    const pc = createPeerConnection();

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      alert('Answer created. Copy the SDP from the next prompt and send it back to the caller.');

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setConnected(true);
        }
      };
    } catch (err) {
      console.error(err);
      alert('Failed to handle offer / create answer.');
    }
  };

  // Person A sets remote answer
  const handleSetRemoteAnswer = async () => {
    const answerString = window.prompt('Paste the SDP answer you received:');
    if (!answerString) return;

    let answer;
    try {
      answer = JSON.parse(answerString);
    } catch (err) {
      alert('Invalid answer JSON.');
      return;
    }

    const pc = peerConnectionRef.current;
    if (!pc) {
      alert('No peer connection. Create an offer first.');
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setConnected(true);
        }
      };
    } catch (err) {
      console.error(err);
      alert('Failed to set remote answer.');
    }
  };

  const handleEndCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    setLocalStream(null);
    setConnected(false);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">WebRTC Video Calls</h2>
        <p className="text-sm text-gray-600 mb-4">
          Open this page in two browsers/devices. One is <b>Caller</b>, the other is <b>Receiver</b>.
          Use the SDPs shown in the prompts to connect.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold mb-1">You</p>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full aspect-video bg-black rounded-lg"
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Remote</p>
            <video
              ref={remoteVideoRef}
              autoPlay
              className="w-full aspect-video bg-black rounded-lg"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-2">
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            1️⃣ Start Camera
          </button>

          <button
            onClick={handleCreateOffer}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            2️⃣ Caller: Create Offer
          </button>

          <button
            onClick={handleAcceptOfferCreateAnswer}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            2️⃣ Receiver: Paste Offer & Create Answer
          </button>

          <button
            onClick={handleSetRemoteAnswer}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            3️⃣ Caller: Paste Answer
          </button>

          <button
            onClick={handleEndCall}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            End Call
          </button>
        </div>

        {connected && (
          <p className="text-sm text-green-600 font-semibold">
            ✅ Peers connected! You should see & hear each other.
          </p>
        )}
      </div>

      {/* Just to keep your original idea of "Free Resources" conceptually */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Free Resources (WebRTC Stack)</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>WebRTC Video Calls</li>
          <li>WebRTC for Beginners (Fireship)</li>
          <li>PeerJS Docs</li>
          <li>simple-peer GitHub</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoConference;
