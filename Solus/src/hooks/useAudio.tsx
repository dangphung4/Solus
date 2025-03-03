import * as React from "react";

interface UseAudioReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  startRecording: () => void; 
  stopRecording: () => void;
  clearAudio: () => void; 
  error: string | null;
}

export function useAudio(): UseAudioReturn {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const initializeMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      // Handle recording stop event
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        audioChunksRef.current = []; // Clear chunks for the next recording
      };
    } catch (err) {
      setError("Error accessing microphone. Please ensure permissions are granted.");
      console.error("Error initializing MediaRecorder:", err);
    }
  };

  const startRecording = () => {
    if (!mediaRecorderRef.current) {
      setError("MediaRecorder not initialized.");
      return;
    }

    setIsRecording(true);
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) {
      setError("MediaRecorder not initialized.");
      return;
    }

    setIsRecording(false);
    mediaRecorderRef.current.stop();

    // Stop all tracks in the stream
    if (mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  React.useEffect(() => {
    initializeMediaRecorder();

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream?.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearAudio,
    error,
  };
}