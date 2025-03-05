import * as React from "react";

interface UseTranscribeReturn {
  transcript: string;
  isTranscribing: boolean;
  transcriptionError: string | null;
  transcribe: (audioBlob: Blob) => Promise<string>;
}

type MimeMap = {
  [key: string]: string;
}

export function useTranscribe(): UseTranscribeReturn {
  const [transcript, setTranscript] = React.useState("");
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const [transcriptionError, setError] = React.useState<string | null>(null);

  const mimeTypeToExtension: MimeMap = {
    "audio/webm": "webm",
    "audio/webm;codecs=opus": "webm",
    "audio/ogg;codecs=opus": "ogg",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
  };

  const transcribe = async (audioBlob: Blob): Promise<string> => {
    setIsTranscribing(true);
    setError(null);

    try {
      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_WHISPER_KEY;
      if (!openaiKey) {
        throw new Error("OpenAI API key is required");
      }

      const formData = new FormData();

      const extension = mimeTypeToExtension[audioBlob.type] || "webm";
      
      formData.append("file", audioBlob, `recording.${extension}`);
      formData.append("model", "whisper-1");
      
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `API error: ${response.status}`
        );
      }

      const data = await response.json();
      
      const transcriptionText = data.text || "";
      setTranscript(transcriptionText);
      return transcriptionText;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to transcribe audio";
      setError(errorMessage);
      return "";
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    transcript,
    isTranscribing,
    transcriptionError,
    transcribe,
  };
}