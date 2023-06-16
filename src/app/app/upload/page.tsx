"use client";

import { getBackCamera, getFrontCamera } from "@/helpers/cameraIdStore";
import { useRouter } from "next/navigation";
import { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";

import RotateIcon from "../../../../public/assets/rotate.svg";
import Image from "next/image";

const Page: React.FunctionComponent = () => {
  const [images, setImages] = useState<null | {
    main: string;
    selfie: string;
  }>(null);

  if (images === null)
    return (
      <Camera
        setImages={(images: { main: string; selfie: string }) =>
          setImages(images)
        }
      />
    );

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images.main} alt="main image" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images.selfie} alt="selfie image" />
    </div>
  );
};

const Camera = ({
  setImages,
}: {
  setImages: (images: { main: string; selfie: string }) => void;
}) => {
  const [frontCamera, setFrontCamera] = useState<string | null>(null);
  const [backCamera, setBackCamera] = useState<string | null>(null);
  const router = useRouter();

  const [camsLoaded, setCamsLoaded] = useState(false);

  useEffect(() => {
    const frontCamera = getFrontCamera();
    const backCamera = getBackCamera();
    setFrontCamera(frontCamera);
    setBackCamera(backCamera);
    setCamsLoaded(true);
  }, []);

  const [cam, setCam] = useState<"front" | "back">("back");

  const frontCamRef = useRef<Webcam>(null);
  const backCamRef = useRef<Webcam>(null);
  const capture = useCallback(() => {
    if (frontCamRef.current === null) throw new Error("webcam ref is null");
    if (backCamRef.current === null) throw new Error("webcam ref is null");

    const frontImage = frontCamRef.current.getScreenshot();
    const backImage = backCamRef.current.getScreenshot();

    if (frontImage === null) throw new Error("could not capture screenshot");
    if (backImage === null) throw new Error("could not capture screenshot");

    setImages({
      main: backImage,
      selfie: frontImage,
    });
  }, [setImages]);

  if (frontCamera === null || backCamera === null) {
    if (camsLoaded) router.push("app/selectCams?callback=app/upload");
    return "";
  }

  return (
    <div>
      <div>
        <Webcam
          ref={frontCamRef}
          screenshotFormat="image/jpeg"
          height={1000}
          width={1000}
          className={
            "absolute rounded  " + (cam === "front" ? "" : " invisible")
          }
          audio={false}
          mirrored
          videoConstraints={{ deviceId: frontCamera, facingMode: "user" }}
        />
        <Webcam
          ref={backCamRef}
          screenshotFormat="image/jpeg"
          height={1000}
          width={1000}
          className={
            "absolute rounded  " + (cam === "back" ? "" : " invisible")
          }
          audio={false}
          mirrored
          videoConstraints={{
            deviceId: backCamera,
            facingMode: "environment",
          }}
        />
      </div>
      <button
        className="absolute bottom-5 left-[calc(50%-(5rem/2))] rounded-full h-20 w-20 border-4 active:bg-white"
        onClick={capture}
      ></button>
      <button
        className="absolute bottom-10 right-10 invert "
        onClick={() => setCam((prev) => (prev === "back" ? "front" : "back"))}
      >
        <Image className="h-12 w-12" src={RotateIcon} alt="rotate icon" />
      </button>
    </div>
  );
};

export default Page;
