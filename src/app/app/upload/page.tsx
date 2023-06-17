"use client";

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
  const [cam, setCam] = useState<"user" | "environment">("environment");

  const camRef = useRef<Webcam>(null);

  const firstImage = useRef<string | null>(null);
  const secondImage = useRef<string | null>(null);

  const capture = () => {
    if (camRef.current === null) throw new Error("webcam ref is null");

    const image = camRef.current.getScreenshot();
    if (image === null) throw new Error("could not capture screenshot");

    firstImage.current = image;

    setCam((prev) => (prev === "user" ? "environment" : "user"));

    // capture second
    setTimeout(() => {
      if (camRef.current === null) throw new Error("webcam ref is null");
      if (firstImage.current === null)
        throw new Error("could not take first image");
      const otherImage = camRef.current.getScreenshot();
      if (otherImage === null) throw new Error("could not take second picture");
      secondImage.current = otherImage;

      setImages({
        main: cam === "user" ? otherImage : firstImage.current,
        selfie: cam === "environment" ? otherImage : firstImage.current,
      });
    }, 1000);
  };

  return (
    <div>
      <div>
        <Webcam
          ref={camRef}
          screenshotFormat="image/jpeg"
          height={1000}
          width={1000}
          className="absolute rounded  "
          audio={false}
          mirrored
          videoConstraints={{ facingMode: cam }}
        />
      </div>
      <button
        className="absolute bottom-5 left-[calc(50%-(5rem/2))] rounded-full h-20 w-20 border-4 active:bg-white"
        onClick={capture}
      ></button>
      <button
        className="absolute bottom-10 right-10 invert "
        onClick={() =>
          setCam((prev) => (prev === "environment" ? "user" : "environment"))
        }
      >
        <Image className="h-12 w-12" src={RotateIcon} alt="rotate icon" />
      </button>
    </div>
  );
};

export default Page;
