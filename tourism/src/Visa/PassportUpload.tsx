import React, { useState, useRef } from "react";
import { FaShieldAlt, FaCamera, FaCheck, FaTimes, FaPassport } from "react-icons/fa";
import { MdOutlineUploadFile, MdPhoneIphone } from "react-icons/md";

const PassportUpload: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [passportImage, setPassportImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isValidPassport, setIsValidPassport] = useState<boolean | null>(null);
  const [isValidProfile, setIsValidProfile] = useState<boolean | null>(null);
  const passportFileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPassportImage(event.target?.result as string);
        validatePassport(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
        validateProfile(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validatePassport = (_imageSrc: string) => {
    setTimeout(() => {
      setIsValidPassport(Math.random() > 0.3);
    }, 1500);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateProfile = (_imageSrc: string) => {
    setTimeout(() => {
      setIsValidProfile(Math.random() > 0.3);
    }, 1500);
  };

  const startCamera = (forPassport: boolean) => {
    setShowCamera(forPassport);
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: forPassport ? "environment" : "user" }
    }).then(mediaStream => {
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    }).catch(err => {
      console.error("Camera access denied:", err);
    });
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL("image/png");
      
      if (showCamera) {
        setPassportImage(imageSrc);
        validatePassport(imageSrc);
      } else {
        setProfileImage(imageSrc);
        validateProfile(imageSrc);
      }
      
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const resetUpload = (isPassport: boolean) => {
    if (isPassport) {
      setPassportImage(null);
      setIsValidPassport(null);
    } else {
      setProfileImage(null);
      setIsValidProfile(null);
    }
    stopCamera();
  };

  const handleSubmit = async () => {
    if (!passportImage || !profileImage) {
      alert("Please upload both passport and profile images");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/api/passport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passportImage,
          profileImage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Upload successful!");
        console.log("API Response:", data);
        setActiveStep(prev => prev + 1);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-24 bg-gradient-to-b from-indigo-600 to-blue-500 flex flex-col items-center pt-12 space-y-10">
        {["Photo", "Passport", "Review", "Add Traveler", "Checkout"].map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center cursor-pointer ${
              idx === activeStep ? "text-white" : "text-blue-100"
            }`}
            onClick={() => setActiveStep(idx)}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              idx === activeStep 
                ? "bg-white text-blue-600 shadow-lg" 
                : "bg-blue-500/30 border border-blue-400/30"
            }`}>
              {idx === activeStep ? (
                <FaCheck className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{idx + 1}</span>
              )}
            </div>
            <span className="text-xs mt-2 font-medium">{item}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white rounded-l-3xl shadow-lg my-4">
        <div className="mb-6 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-medium">
          <FaShieldAlt className="text-indigo-600" />
          <span>Your data is securely encrypted</span>
        </div>

        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Visa on 15 May, 01:02 AM
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            {activeStep === 0 ? "Upload your " : "Verify your "}
            <span className="text-blue-600">
              {activeStep === 0 ? "profile photo" : "passport front page"}
            </span>
          </h2>
          <p className="text-green-600 mt-2 font-medium flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            1,429 users uploaded today
          </p>
        </div>

        {/* Profile Image Upload Section */}
        {activeStep === 0 && (
          <div className="flex flex-col items-center">
            {profileImage ? (
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-6 border-2 border-dashed border-gray-300 rounded-xl p-2">
                  <img 
                    src={profileImage} 
                    alt="Profile preview" 
                    className="max-h-96 rounded-lg"
                  />
                  {isValidProfile !== null && (
                    <div className={`absolute -top-3 -right-3 p-2 rounded-full ${
                      isValidProfile ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {isValidProfile ? <FaCheck /> : <FaTimes />}
                    </div>
                  )}
                </div>

                {isValidProfile === true ? (
                  <div className="text-green-600 font-medium mb-4">
                    Profile photo verified successfully!
                  </div>
                ) : isValidProfile === false ? (
                  <div className="text-red-600 font-medium mb-4">
                    Couldn't verify profile photo. Please try again.
                  </div>
                ) : (
                  <div className="text-blue-600 font-medium mb-4">
                    Verifying your profile photo...
                  </div>
                )}

                <button
                  onClick={() => resetUpload(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Upload Again
                </button>
              </div>
            ) : showCamera === false ? (
              <div className="flex flex-col items-center p-8 rounded-2xl w-full max-w-md border-2 border-dashed border-gray-300">
                <div className="flex justify-center gap-8 mb-6">
                  {/* File Upload */}
                  <div 
                    className="flex flex-col items-center p-6 rounded-xl cursor-pointer bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                    onClick={() => profileFileInputRef.current?.click()}
                  >
                    <MdOutlineUploadFile className="text-4xl text-blue-600 mb-3" />
                    <div className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                      Upload Photo
                    </div>
                    <input
                      type="file"
                      ref={profileFileInputRef}
                      onChange={handleProfileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Camera Upload */}
                  <div 
                    className="flex flex-col items-center p-6 rounded-xl cursor-pointer bg-gray-900 text-white hover:bg-gray-800 transition-all"
                    onClick={() => startCamera(false)}
                  >
                    <FaCamera className="text-3xl mb-3" />
                    <div className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                      Take Photo
                    </div>
                  </div>
                </div>

                <div className="text-center text-blue-600 mt-4 cursor-pointer inline-flex items-center gap-2">
                  <MdPhoneIphone className="text-xl" />
                  <span className="font-medium">Upload from Phone</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md border-2 border-gray-200 rounded-xl overflow-hidden mb-4">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className="w-full"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      onClick={capturePhoto}
                      className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <FaCamera className="text-2xl text-gray-700" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={stopCamera}
                  className="text-red-600 font-medium hover:underline"
                >
                  Cancel Camera
                </button>
              </div>
            )}
          </div>
        )}

        {/* Passport Upload Section */}
        {activeStep === 1 && (
          <div className="flex flex-col items-center">
            {passportImage ? (
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-6 border-2 border-dashed border-gray-300 rounded-xl p-2">
                  <img 
                    src={passportImage} 
                    alt="Passport preview" 
                    className="max-h-96 rounded-lg"
                  />
                  {isValidPassport !== null && (
                    <div className={`absolute -top-3 -right-3 p-2 rounded-full ${
                      isValidPassport ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {isValidPassport ? <FaCheck /> : <FaTimes />}
                    </div>
                  )}
                </div>

                {isValidPassport === true ? (
                  <div className="text-green-600 font-medium mb-4">
                    Passport verified successfully!
                  </div>
                ) : isValidPassport === false ? (
                  <div className="text-red-600 font-medium mb-4">
                    Couldn't verify passport. Please try again.
                  </div>
                ) : (
                  <div className="text-blue-600 font-medium mb-4">
                    Verifying your passport...
                  </div>
                )}

                <button
                  onClick={() => resetUpload(true)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Upload Again
                </button>
              </div>
            ) : showCamera === true ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md border-2 border-gray-200 rounded-xl overflow-hidden mb-4">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className="w-full"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      onClick={capturePhoto}
                      className="bg-white p-4 rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <FaCamera className="text-2xl text-gray-700" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={stopCamera}
                  className="text-red-600 font-medium hover:underline"
                >
                  Cancel Camera
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center p-8 rounded-2xl w-full max-w-md border-2 border-dashed border-gray-300">
                <div className="flex justify-center gap-8 mb-6">
                  {/* File Upload */}
                  <div 
                    className="flex flex-col items-center p-6 rounded-xl cursor-pointer bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                    onClick={() => passportFileInputRef.current?.click()}
                  >
                    <MdOutlineUploadFile className="text-4xl text-blue-600 mb-3" />
                    <div className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                      Upload Passport
                    </div>
                    <input
                      type="file"
                      ref={passportFileInputRef}
                      onChange={handlePassportUpload}
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                  </div>

                  {/* Camera Upload */}
                  <div 
                    className="flex flex-col items-center p-6 rounded-xl cursor-pointer bg-gray-900 text-white hover:bg-gray-800 transition-all"
                    onClick={() => startCamera(true)}
                  >
                    <FaPassport className="text-3xl mb-3" />
                    <div className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                      Scan Passport
                    </div>
                  </div>
                </div>

                <div className="text-center text-blue-600 mt-4 cursor-pointer inline-flex items-center gap-2">
                  <MdPhoneIphone className="text-xl" />
                  <span className="font-medium">Upload from Phone</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation and Submit */}
        <div className="mt-12 flex justify-between max-w-md mx-auto">
          {activeStep > 0 && (
            <button
              onClick={() => setActiveStep(prev => prev - 1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          
          {activeStep === 1 && (
            <button
              onClick={handleSubmit}
              disabled={!passportImage || !profileImage || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Documents"}
            </button>
          )}
          
          {activeStep === 0 && (
            <button
              onClick={() => setActiveStep(prev => prev + 1)}
              disabled={!profileImage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${activeStep * 50}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="w-96 p-8 bg-gradient-to-b from-white to-blue-50 border-l border-gray-200">
        <div className="sticky top-8">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
              {activeStep === 0 ? <FaCamera /> : <FaPassport />}
            </span>
            {activeStep === 0 ? "Photo Requirements" : "Passport Requirements"}
          </h3>
          
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <p className="text-sm text-gray-700 mb-4">
              {activeStep === 0 
                ? "For fastest approval, ensure your profile photo:" 
                : "For fastest approval, ensure your passport:"}
            </p>
            <ol className="space-y-3">
              {(activeStep === 0 
                ? [
                    "Shows your full face clearly",
                    "Neutral expression with eyes open",
                    "Plain light-colored background",
                    "No hats or sunglasses",
                    "High resolution (at least 600x600px)"
                  ]
                : [
                    "Shows the entire front page",
                    "Is valid for at least 6 months",
                    "Has clear, readable text",
                    "No glare or reflections",
                    "File size under 5MB"
                  ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full">
                    <FaCheck className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Need help with your upload?</p>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              Contact our support team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassportUpload;