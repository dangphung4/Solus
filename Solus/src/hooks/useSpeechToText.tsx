import * as React from "react";

interface useSpeechToTextReturn {
  startListening: (onSpeechEnd?: () => void, onComplete?: (finalTranscript: string) => void) => Promise<void>;
}

export function useSpeechToText(): useSpeechToTextReturn {
  const [transcript, setTranscript] = React.useState("");
  const [, setError] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const isListeningRef = React.useRef(false);
  const onCompleteCallbackRef = React.useRef<((finalTranscript: string) => void) | undefined>(undefined);
	const onSpeechEndCallbackRef = React.useRef<(() => void) | undefined>(undefined);
  const transcriptRef = React.useRef("");

  React.useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Your browser doesn't support speech recognition");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Default to English, can be made user configurable in future
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = event.results[event.results.length - 1][0].transcript;
      const isFinal = event.results[event.results.length - 1].isFinal;
      
      const updatedTranscript = currentTranscript.trim();
      setTranscript(updatedTranscript);
      transcriptRef.current = updatedTranscript;
      
      if (isFinal && !recognition.continuous) {
        isListeningRef.current = false;
        recognition.stop();
      }
    };
		
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Recognition error: ${event.error}`);
      if (onCompleteCallbackRef.current) {
        onCompleteCallbackRef.current(transcriptRef.current.trim());
      }
			if (onSpeechEndCallbackRef.current) {
        onSpeechEndCallbackRef.current();
      }
    };
    
    recognition.onend = () => {
      if (isListeningRef.current) {
        recognition.start();
      } else {
        if (onCompleteCallbackRef.current) {
          onCompleteCallbackRef.current(transcriptRef.current.trim());
        }
				if (onSpeechEndCallbackRef.current) {
          onSpeechEndCallbackRef.current();
        }
				setTranscript("");
      }
    };
    
    recognition.onspeechend = () => {
      if (!recognition.continuous) {
        isListeningRef.current = false;
        recognition.stop();
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  React.useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

	
  const startListening = async (onSpeechEnd?: () => void, onComplete?: (finalTranscript: string) => void): Promise<void> => {
    setError(null);
    setTranscript("");
    transcriptRef.current = "";
    
    onCompleteCallbackRef.current = onComplete;
		onSpeechEndCallbackRef.current = onSpeechEnd;
    
    if (!recognitionRef.current) {
      setError("Speech recognition not available");
      return;
    }
    
    try {
      isListeningRef.current = true;
      recognitionRef.current.start();
    } catch (err: any) {
      setError(err.message || "Failed to start speech recognition");
      if (onComplete) {
        onComplete("");
      }
			if (onSpeechEnd) {
        onSpeechEnd();
      }
    }
  };

  return {
    startListening
  };
}