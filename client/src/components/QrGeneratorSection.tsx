import React, { useState, useRef, useEffect } from "react";
import QRCodeStyling, { GradientType } from "qr-code-styling";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import {Link, Image as LucideImage, Palette, Download, Sparkles, Plus, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from 'next/image';

const solidColors: string[] = [
  "#000000", // Black
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
];

const gradients: { type: GradientType; rotation: number; colorStops: { offset: number; color: string; }[]; }[] = [ 
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#feda75" }, { offset: 0.5, color: "#d62976" }, { offset: 1, color: "#4f5bd5" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#FF5733" }, { offset: 0.5, color: "#FFC300" }, { offset: 1, color: "#DAF7A6" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#C70039" }, { offset: 0.5, color: "#900C3F" }, { offset: 1, color: "#581845" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#1ABC9C" }, { offset: 0.5, color: "#3498DB" }, { offset: 1, color: "#9B59B6" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#2ECC71" }, { offset: 0.5, color: "#F1C40F" }, { offset: 1, color: "#E67E22" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#34495E" }, { offset: 0.5, color: "#7F8C8D" }, { offset: 1, color: "#BDC3C7" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#8E44AD" }, { offset: 0.5, color: "#C0392B" }, { offset: 1, color: "#D35400" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#1ABC9C" }, { offset: 0.5, color: "#27AE60" }, { offset: 1, color: "#2980B9" }], },
   { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#06B6D4" }, { offset: 1, color: "#3B82F6" }], }, 
  { type: "linear", rotation: 45, colorStops: [{ offset: 0, color: "#ff9a8b" }, { offset: 1, color: "#ff6a88" }], },
  { type: "linear", rotation: 90, colorStops: [{ offset: 0, color: "#fccb90" }, { offset: 1, color: "#ee7724" }], }, 
  { type: "linear", rotation: 135, colorStops: [{ offset: 0, color: "#e0c3fc" }, { offset: 1, color: "#8ec5fc" }], }, 
  { type: "linear", rotation: 180, colorStops: [{ offset: 0, color: "#a1c4fd" }, { offset: 1, color: "#c2e9fb" }], }, 
  { type: "linear", rotation: 225, colorStops: [{ offset: 0, color: "#d4fc79" }, { offset: 1, color: "#96e6a1" }], },
  { type: "linear", rotation: 270, colorStops: [{ offset: 0, color: "#f093fb" }, { offset: 1, color: "#f5576c" }], }, 
  { type: "linear", rotation: 315, colorStops: [{ offset: 0, color: "#4facfe" }, { offset: 1, color: "#00f2fe" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#a8edea" }, { offset: 1, color: "#fed6e3" }], }, 
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#c471f5" }, { offset: 1, color: "#fe9090" }], },
  { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#30cfd0" }, { offset: 1, color: "#330867" }], }, 
];

const floatAnimation = `
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
`;

// Move this code inside a useEffect hook
// const style = document.createElement('style');
// style.textContent = floatAnimation;
// document.head.appendChild(style);

// QR Code Generator Section
export default function QrGeneratorSection( { className }: { className?: string } ) {
  const [inputValue, setInputValue] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState('');
  const [centerImageType, setCenterImageType] = useState('none'); // 'none', 'emoji', 'logo'
  const [logoImage, setLogoImage] = useState<string | ArrayBuffer | null>(null);
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [colorMode, setColorMode] = useState<'gradient' | 'solid'>('gradient'); // 'gradient' or 'solid'
  const [solidColor, setSolidColor] = useState<string>('#06B6D4'); 
  const colorPickerRef = useRef<HTMLInputElement>(null); 
  const qrRef = useRef<HTMLDivElement>(null);

  // Effect to inject the animation style
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = floatAnimation;
    document.head.appendChild(style);

    // Clean up the style tag on component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (qrValue && qrRef.current) {
      qrRef.current.innerHTML = "";

      let centerImageUrl: string | undefined = undefined;
      if (centerImageType === 'emoji' && emoji) {
        const emojiCanvas = document.createElement("canvas");
        emojiCanvas.width = 100;
        emojiCanvas.height = 100;
        const ctx = emojiCanvas.getContext("2d");
        if (ctx) {
          ctx.font = "80px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(emoji, 50, 50);
          centerImageUrl = emojiCanvas.toDataURL();
        }
      } else if (centerImageType === 'logo' && logoImage) {
         centerImageUrl = logoImage as string;
      }
      
      const qr = new QRCodeStyling({
        width: 256,
        height: 256,
        data: qrValue,
        image: centerImageUrl,
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.25,
          margin: 2,
        },
        dotsOptions: {
          type: "dots",
          color: colorMode === 'solid' ? solidColor : undefined,
          gradient: colorMode === 'gradient' ? gradients[selectedGradientIndex] : undefined,
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: colorMode === 'solid' ? solidColor : undefined,
          gradient: colorMode === 'gradient' ? gradients[selectedGradientIndex] : undefined,
        },
        cornersDotOptions: {
          type: "rounded",
          color: colorMode === 'solid' ? solidColor : undefined,
          gradient: colorMode === 'gradient' ? gradients[selectedGradientIndex] : undefined,
        },        
        backgroundOptions: {
          color: "#ffffff", 
        },
      });

      qr.append(qrRef.current);
    }
  }, [qrValue, emoji, centerImageType, logoImage, selectedGradientIndex, colorMode, solidColor]);

  const handleGenerateQr = () => {
    if (inputValue.trim()) {
      setLoading(true);
      setQrValue(inputValue);
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadQr = () => {
    if (qrRef.current) {
        const qrCanvas = qrRef.current.querySelector('canvas');
        if (qrCanvas) {
            const url = qrCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = 'custom-qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
  };

  const handleCopyQr = () => {
    if (!qrRef.current) return;

    const qrCanvas = qrRef.current.querySelector('canvas');
    if (!qrCanvas) return;

    qrCanvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        console.log('QR code image copied to clipboard');
        toast.success('QR code copied!');
      } catch (error) {
        console.error('Error copying QR code image:', error);
        alert('Failed to copy QR code image.');
      }
    }, 'image/png');
  };

  return (
    <div 
      className={`py-4 px-4 flex-grow flex flex-col justify-center items-center ${className}`}
      style={{
        backgroundImage: `url('/assests/backgroundImg.png')`,
        // background: 'radial-gradient(at center top, #0397A6, #030712)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-center mb-8 px-4 w-3/4 mx-auto">
        <h1 className='text-xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed md:leading-loose'>
        Create <span className="bg-gradient-to-r from-blue-700 to-cyan-500 text-transparent bg-clip-text">stunning, personalized</span> QR codes from links and text!
        </h1>
      </div>

      <div className="w-full max-w-6xl mx-auto rounded-xl">
        {/* Main Card Container */}
        <div
          className="rounded-2xl p-8 flex flex-col md:flex-row border border-1 "
          style={{
            backgroundColor: 'rgba(243, 241, 241, 0.15)',
            boxShadow: '0 4px 30px rgba(0, 240, 255, 0.3)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >

          <div className="w-full md:w-1/2 p-4 flex flex-col gap-4">

            <div>
              <label htmlFor="url-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Link className="w-5 h-5" />
                URL or Text
              </label>
              <input
                type="text"
                id="url-text"
                placeholder="Paste your link or message here..."
                className="mt-1 block w-full p-3 rounded-xl text-gray-800 dark:text-gray-200 placeholder-white dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
                style={{
                  backgroundColor: 'rgba(243, 241, 241, 0.15)',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                <LucideImage className="w-5 h-5" />
                Center Image
              </label>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className={`flex-grow-0 w-full md:flex-grow md:w-0 text-center p-2 rounded-xl cursor-pointer border ${centerImageType === 'none' ? 'border-blue-600 dark:border-blue-500 shadow-sm' : 'border-gray-300 dark:border-gray-600'}`}
                   style={{
                     background: centerImageType === 'none' ? 'linear-gradient(to right, rgba(6, 182, 212, 0.5), rgba(59, 130, 246, 0.5))': 'rgba(243, 241, 241, 0.15)',
                     backdropFilter: 'blur(5px)',
                     WebkitBackdropFilter: 'blur(5px)',
                     transition: 'background 0.3s ease-in-out',
                   }}
                   onMouseEnter={() => {}}
                   onClick={() => {
                      setCenterImageType('none');
                      setEmoji('');
                      setLogoImage(null);
                   }}
                >
                  <input
                    type="radio"
                    className="sr-only peer"
                    name="centerImage"
                    value="none"
                    checked={centerImageType === 'none'}
                    onChange={() => {}}
                  />
                  <span className={`flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300 ${centerImageType === 'none' ? 'text-blue-800 dark:text-blue-200 font-semibold' : ''}`}><Sparkles className="w-4 h-4"/>None</span>
                </div>

                {/* Emoji Option */}
                <div className={`flex-grow-0 w-full md:flex-grow md:w-0 text-center p-2 rounded-xl cursor-pointer border ${centerImageType === 'emoji' ? 'border-blue-600 dark:border-blue-500 shadow-sm' : 'border-gray-300 dark:border-gray-600'}`}
                   style={{
                     background: centerImageType === 'emoji' ? 'linear-gradient(to right, rgba(6, 182, 212, 0.5), rgba(59, 130, 246, 0.5))': 'rgba(243, 241, 241, 0.15)',
                     backdropFilter: 'blur(5px)',
                     WebkitBackdropFilter: 'blur(5px)',
                     transition: 'background 0.3s ease-in-out',
                   }}
                   onMouseEnter={() => {}}
                   onClick={() => {
                      setCenterImageType('emoji');
                      setLogoImage(null);
                   }}
                >
                  <input
                    type="radio"
                    className="sr-only peer"
                    name="centerImage"
                    value="emoji"
                    checked={centerImageType === 'emoji'}
                    onChange={() => {}}
                  />
                  <span className={`flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300 ${centerImageType === 'emoji' ? 'text-blue-800 dark:text-blue-200 font-semibold' : ''}`}>😊 Emoji</span>
                </div>

                {/* Logo Option */}
                <div className={`flex-grow-0 w-full md:flex-grow md:w-0 text-center p-2 rounded-xl cursor-pointer border ${centerImageType === 'logo' ? 'border-blue-600 dark:border-blue-500 shadow-sm' : 'border-gray-300 dark:border-gray-600'}`}
                   style={{
                     background: centerImageType === 'logo' ? 'linear-gradient(to right, rgba(6, 182, 212, 0.5), rgba(59, 130, 246, 0.5))': 'rgba(243, 241, 241, 0.15)',
                     backdropFilter: 'blur(5px)',
                     WebkitBackdropFilter: 'blur(5px)',
                     transition: 'background 0.3s ease-in-out',
                   }}
                   onMouseEnter={() => {}}
                   onClick={() => {
                      setCenterImageType('logo');
                      setEmoji('');
                   }}
                >
                  <span className={`flex items-center justify-center gap-1 text-gray-700 dark:text-gray-300 ${centerImageType === 'logo' ? 'text-blue-800 dark:text-blue-200 font-semibold' : ''}`}><LucideImage className="w-4 h-4"/>Logo</span>
                </div>

              </div>

              {centerImageType === 'emoji' && (
                <div className="relative mt-2">
                   <button
                     className="w-full text-left p-3 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
                     style={{
                       backgroundColor: 'rgba(243, 241, 241, 0.15)',
                       backdropFilter: 'blur(5px)',
                       WebkitBackdropFilter: 'blur(5px)',
                     }}
                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                   >
                     {emoji ? emoji : '😊 Select Emoji'}
                   </button>
                  {showEmojiPicker && (
                    <div className="absolute z-10" style={{ bottom: '100%', left: '0' }}>
                      <Picker
                        data={data}
                        onEmojiSelect={(emoji: { native: string }) => {
                          setEmoji(emoji.native);
                          setShowEmojiPicker(false);
                        }}
                      />
                    </div>
                  )}
                 </div>
              )}

              {centerImageType === 'logo' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-700 dark:file:text-blue-100 dark:hover:file:bg-blue-800"
                   />
              )}
            </div>

            {/* Gradient/Solid Color Options */}
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                <Palette className="w-5 h-5" />
                Color
              </label>
              {/* Tabs for Gradient/Solid */}
              <div className="flex mb-4">
                  <button
                      className={`px-4 py-2 text-sm font-medium rounded-l-xl ${colorMode === 'gradient' ? ' text-white' : ' text-gray-700 dark:text-gray-300'} focus:outline-none`}
                      style={{
                        background: colorMode === 'gradient' ? 'linear-gradient(to right, rgba(6, 182, 212, 0.5), rgba(59, 130, 246, 0.5))': 'rgba(243, 241, 241, 0.15)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        transition: 'background 0.3s ease-in-out',
                      }}
                      onMouseEnter={() => {}}
                      onClick={() => setColorMode('gradient')}
                  >
                      Gradient
                  </button>
                  <button
                      className={`px-4 py-2 text-sm font-medium rounded-r-xl ${colorMode === 'solid' ? ' text-white' : ' text-gray-700 dark:text-gray-300'} focus:outline-none`}
                      style={{
                        background: colorMode === 'solid' ? 'linear-gradient(to right, rgba(6, 182, 212, 0.5), rgba(59, 130, 246, 0.5))': 'rgba(243, 241, 241, 0.15)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        transition: 'background 0.3s ease-in-out',
                      }}
                      onMouseEnter={() => {}}
                      onClick={() => setColorMode('solid')}
                  >
                      Solid Color
                  </button>
              </div>

              {/* Gradient Options - Boxes */}
              {colorMode === 'gradient' && (
                <div className="flex flex-wrap gap-2">
                  {gradients.map((gradient, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-full cursor-pointer ${selectedGradientIndex === index ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''}`}
                      style={{
                        background: `linear-gradient(${gradient.rotation}deg, ${gradient.colorStops.map(stop => `${stop.color} ${stop.offset * 100}%`).join(', ')})`,
                      }}
                      onClick={() => setSelectedGradientIndex(index)}
                      title={`Gradient ${index + 1}`}
                    ></div>
                  ))}
                </div>
              )}

              {/* Solid Color Options - Boxes and Picker */}
              {colorMode === 'solid' && (
                <div className="flex flex-wrap items-center gap-2 relative">
                   {solidColors.map((color, index) => (
                      <div
                        key={index}
                        className={`w-10 h-10 rounded-full cursor-pointer border ${solidColor === color ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : 'border-gray-300 dark:border-gray-600'}`}
                        style={{
                           backgroundColor: color,
                        }}
                        onClick={() => setSolidColor(color)}
                        title={`Solid Color ${index + 1}`}
                      ></div>
                   ))}
                   {/* Plus box to open color picker */}
                   <div
                      className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => colorPickerRef.current?.click()}
                      title="Choose custom color"
                   >
                      <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                   </div>

                   {/* Hidden Color Picker Input */}
                     <input
                       type="color"
                       value={solidColor}
                       onChange={(e) => setSolidColor(e.target.value)}
                       className="sr-only"
                       ref={colorPickerRef}
                     />
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              className="w-1/2 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => {
                handleGenerateQr();
              }}
              disabled={!inputValue.trim()}
            >
               <Sparkles className="w-6 h-6" />
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          <div className="hidden md:block w-[1px] bg-gradient-to-b from-transparent via-blue-500 to-transparent dark:via-cyan-500"></div>

          {/* Left side: QR Code Display and Download Button */}
          <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-16 w-16 mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">Generating...</p>
              </div>
            ) : qrValue ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Enhanced white glowing effect behind QR code */}
                  <div className="absolute inset-0 bg-white rounded-xl blur-xl opacity-40 animate-pulse"></div>
                  <div className="absolute inset-0 bg-white rounded-xl blur-lg opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Animated QR code container */}
                  <div 
                    className="bg-white rounded-xl mb-4 p-3 md:p-4 overflow-hidden relative animate-float" 
                    ref={qrRef}
                    style={{
                      animation: 'float 3s ease-in-out infinite',
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                    }}
                  ></div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {/* Download Button */}
                  <button 
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 px-4 rounded-xl hover:from-blue-700 hover:to-cyan-600 flex items-center justify-center gap-2"
                    onClick={handleDownloadQr}
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  
                  {/* Copy Image Button */}
                  <button
                    className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-green-500 text-white py-2 px-4 rounded-xl hover:from-emerald-700 hover:to-green-600 flex items-center justify-center gap-2"
                    onClick={handleCopyQr}
                    disabled={!qrValue}
                  >
                    <Copy className="w-5 h-5" />
                    Copy QR
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 dark:bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-gray-800 dark:text-gray-200 text-2xl font-semibold mb-2">Ready to Generate</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center">Enter a URL or text and click generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
