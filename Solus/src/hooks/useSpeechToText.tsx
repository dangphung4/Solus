import { useAudio } from "@/hooks/useAudio";
import { useTranscribe } from "@/hooks/useTranscribe";

export function useSpeechToText() {
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    clearAudio
  } = useAudio();

  const { transcribe } = useTranscribe();

  const handleRecord = async (): Promise<string | undefined> => {
    if (isRecording) {
      return new Promise<string>((resolve) => {
        stopRecording(async (audioBlob) => {
          try {
            const transcriptionText = await transcribe(audioBlob);
            clearAudio();
            resolve(transcriptionText);
          } catch (error) {
            console.error("Error transcribing audio:", error);
            resolve("");
          }
        });
      });
    } else {
      startRecording();
      return;
    }
  };

  return { handleRecord, isRecording };
}
