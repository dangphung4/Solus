import * as React from "react";

interface UseAudioReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  startRecording: () => void;
  stopRecording: (onStop?: (blob: Blob) => void) => void;
  clearAudio: () => void;
  audioError: string | null;
  supportedMimeType: string | null;
}

export function useAudio(): UseAudioReturn {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [audioError, setError] = React.useState<string | null>(null);
  const [isSupported, setIsSupported] = React.useState<boolean | null>(null);
  const [supportedMimeType, setSupportedMimeType] = React.useState<string | null>(null);
  
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const onStopCallbackRef = React.useRef<((blob: Blob) => void) | null>(null);

  React.useEffect(() => {
    const checkSupport = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("Media devices API not supported in this browser");
          setIsSupported(false);
          return;
        }

        if (!window.MediaRecorder) {
          setError("MediaRecorder API not supported in this browser");
          setIsSupported(false);
          return;
        }

        const mimeTypes = [
          'audio/webm',
          'audio/webm;codecs=opus',
          'audio/ogg;codecs=opus',
          'audio/mp4',
          'audio/mpeg'
        ];

        // Find browser supported mime type
        const supportedType = mimeTypes.find(type => {
          try {
            return MediaRecorder.isTypeSupported(type);
          } catch (e) {
            return false;
          }
        });

        if (!supportedType) {
          setError("No supported audio MIME types found in this browser");
          setIsSupported(false);
          return;
        }
        
        setSupportedMimeType(supportedType);
        setIsSupported(true);
      } catch (err) {
        console.error("Error checking MediaRecorder support:", err);
        setError("Failed to check browser compatibility");
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  const initializeMediaRecorder = async () => {
    if (!isSupported) {
      setError("MediaRecorder is not supported in this browser");
      return false;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      try {
        if (supportedMimeType) {
          mediaRecorderRef.current = new MediaRecorder(stream, { 
            mimeType: supportedMimeType 
          });
        } else {
          // Fallback to default since no supported type was found but browser check passed
          mediaRecorderRef.current = new MediaRecorder(stream);
        }
      } catch (e) {
        console.warn("Failed with specific MIME type, trying default");
        mediaRecorderRef.current = new MediaRecorder(stream);
      }

      // Handle audio chunks during recording
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop, feed onStop callback function new blob
      mediaRecorderRef.current.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current);
          setAudioBlob(audioBlob);
          
          if (onStopCallbackRef.current) {
            onStopCallbackRef.current(audioBlob);
            onStopCallbackRef.current = null;
          }
        }
      };

      return true;
    } catch (err: any) {
      setError(`Microphone access error: ${err.message || "Unknown error"}`);
      console.error("Media initialization error:", err);
      return false;
    }
  };

  const startRecording = async () => {
    if (!isSupported) {
      setError("Recording is not supported in this browser");
      return;
    }

    try {
      const success = await initializeMediaRecorder();
      if (!success) return;

      audioChunksRef.current = [];
      setError(null);

      // Collect small audio chunks frequently
      mediaRecorderRef.current?.start(10);
      setIsRecording(true);
    } catch (err: any) {
      setError(`Recording start error: ${err.message || "Unknown error"}`);
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = (onStop?: (blob: Blob) => void) => {
    try {
      // Store the callback to be called when the recording is stopped
      if (onStop) {
        onStopCallbackRef.current = onStop;
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      } else if (onStop && audioBlob) {
        // Fallback for if we already have a blob and are somehow calling stopRecording while not recording
        onStop(audioBlob);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
      
      setIsRecording(false);
    } catch (err: any) {
      setError(`Recording stop error: ${err.message || "Unknown error"}`);
      console.error("Error stopping recording:", err);
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    audioChunksRef.current = [];
  };

  // Clean up resources when component unmounts
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      mediaRecorderRef.current = null;
      streamRef.current = null;
    };
  }, []);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearAudio,
    audioError,
    supportedMimeType
  };
}