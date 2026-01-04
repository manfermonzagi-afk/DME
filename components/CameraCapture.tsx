
import React, { useRef, useState, useCallback } from 'react';

interface CameraCaptureProps {
  label: string;
  onCapture: (base64: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ label, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCapturing(true);
    } catch (err) {
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-white">
      <span className="font-semibold text-gray-700">{label}</span>
      
      {capturedImage ? (
        <div className="relative group">
          <img src={capturedImage} alt="Captura" className="h-48 w-full object-cover rounded shadow" />
          <button 
            type="button"
            onClick={() => setCapturedImage(null)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
          >
            Refazer
          </button>
        </div>
      ) : isCapturing ? (
        <div className="flex flex-col items-center space-y-2">
          <video ref={videoRef} autoPlay playsInline className="h-48 w-full object-cover rounded bg-black" />
          <div className="flex space-x-2">
            <button type="button" onClick={capturePhoto} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Capturar</button>
            <button type="button" onClick={stopCamera} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancelar</button>
          </div>
        </div>
      ) : (
        <button 
          type="button" 
          onClick={startCamera} 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Abrir Câmera
        </button>
      )}
    </div>
  );
};

export default CameraCapture;
