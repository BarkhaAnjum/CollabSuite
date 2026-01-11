import React, { useState, useRef } from "react";
import { Video, Users, Copy, Check, PhoneOff, Mic, MicOff, Camera, CameraOff } from "lucide-react";

const VideoConference = () => {
  const [meetingId, setMeetingId] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [copied, setCopied] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);

  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const localVideoRef = useRef(null);

  // Generate unique meeting ID
  const createMeeting = () => {
    const newId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setGeneratedId(newId);
    setMeetingId(newId);
  };

  // Copy join link
  const copyLink = () => {
    const link = `${window.location.origin}?meeting=${generatedId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Start the meeting (host or guest)
  const joinMeeting = async () => {
    if (!meetingId.trim()) return alert("Please enter Meeting ID");

    setInMeeting(true);

    try {
      // Get user webcam + mic
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera/Mic access denied.");
    }
  };

  // Leave meeting
  const leaveMeeting = () => {
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    setInMeeting(false);
    setMicMuted(false);
    setCameraOff(false);
  };

  // Toggle Mic
  const toggleMic = () => {
    setMicMuted(!micMuted);

    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = micMuted));
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    setCameraOff(!cameraOff);

    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = cameraOff));
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">

      {/* TITLE */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Video className="w-7 h-7" /> Video Conference
      </h2>

      {/* If in meeting -> show meeting UI */}
      {inMeeting ? (
        <div className="space-y-6">

          {/* VIDEOS */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* SELF VIEW */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted={micMuted}
                className={`w-full ${cameraOff ? "hidden" : "block"}`}
              />

              {/* CAMERA OFF PLACEHOLDER */}
              {cameraOff && (
                <div className="w-full h-60 flex flex-col items-center justify-center bg-gray-900 text-white">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-3xl font-bold">
                    U
                  </div>
                  <p className="mt-2 text-gray-300">Camera Off</p>
                </div>
              )}

              <p className="text-center p-2 text-sm text-gray-700 dark:text-gray-300">
                You
              </p>
            </div>

            {/* OTHER USER */}
            <div className="bg-gray-300 dark:bg-gray-600 rounded-xl overflow-hidden flex items-center justify-center">
              <p className="text-gray-600 dark:text-gray-300">
                Waiting for participant…
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex justify-center gap-4 mt-4">

            {/* MIC TOGGLE */}
            <button
              onClick={toggleMic}
              className={`px-5 py-3 rounded-full shadow-lg transition flex items-center gap-2 ${
                micMuted
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              {micMuted ? <MicOff /> : <Mic />}
              {micMuted ? "Mic Off" : "Mic On"}
            </button>

            {/* CAMERA TOGGLE */}
            <button
              onClick={toggleCamera}
              className={`px-5 py-3 rounded-full shadow-lg transition flex items-center gap-2 ${
                cameraOff
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              {cameraOff ? <CameraOff /> : <Camera />}
              {cameraOff ? "Camera Off" : "Camera On"}
            </button>

            {/* LEAVE */}
            <button
              onClick={leaveMeeting}
              className="px-6 py-3 bg-red-600 text-white rounded-full flex items-center gap-2 hover:bg-red-700 hover:scale-105 active:scale-95 transition"
            >
              <PhoneOff /> Leave
            </button>
          </div>
        </div>
      ) : (

        /* JOIN + CREATE SCREEN */
        <div className="space-y-6">

          {/* CREATE MEETING */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-md border dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Create New Meeting</h3>
            
            <button
              onClick={createMeeting}
              className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition flex items-center gap-2"
            >
              <Users /> Create Meeting
            </button>

            {generatedId && (
              <div className="mt-4 space-y-2">
                <p className="text-gray-700 dark:text-gray-300 text-sm">Share this Meeting ID:</p>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-mono">
                    {generatedId}
                  </div>

                  <button
                    onClick={copyLink}
                    className="p-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:scale-110 transition"
                  >
                    {copied ? <Check className="text-green-500" /> : <Copy />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* JOIN MEETING */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-md border dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Join a Meeting</h3>

            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter Meeting ID"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg mb-4"
            />

            <button
              onClick={joinMeeting}
              className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition flex items-center gap-2"
            >
              Join Meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConference;
