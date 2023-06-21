"use client";
import { useRef, useState } from "react";
import Webcam from "react-webcam";

import RotateIcon from "../../../../public/assets/rotate.svg";
import Image from "next/image";
import { base64ToFile } from "@/helpers/base64ToFile";

const Page: React.FunctionComponent = () => {
  const [images, setImages] = useState<null | {
    main: string;
    selfie: string;
  }>(null);

  const post = async () => {
    if (images === null) return;

    const main = base64ToFile(images.main, "mainImage.webp");
    const selfie = base64ToFile(images.selfie, "selfie.webp");

    let formData = new FormData();

    formData.append("mainImage", main);
    formData.append("selfie", selfie);
    formData.set("postedAt", Date.now().toString());
    fetch("/api/post", { method: "POST", body: formData })
      .then((res) => res.json())
      .then(console.log);

    // fetch("/api/post", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     mainImage: await main.arrayBuffer(),
    //     selfie: await selfie.arrayBuffer(),
    //     postedAt: Date.now(),
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then(console.log);
  };

  if (images === null)
    return (
      <Camera
        setImages={(images: { main: string; selfie: string }) =>
          setImages(images)
        }
      />
    );

  return (
    <div className="">
      <div className="relative w-full aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="rounded absolute top-4 left-4 h-40"
          src={images.main}
          alt="main image"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="rounded" src={images.selfie} alt="selfie image" />
      </div>
      <button onClick={post}>post</button>
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

  const capture = () => {
    if (camRef.current === null) throw new Error("webcam ref is null");

    const image = camRef.current.getScreenshot();
    if (image === null) throw new Error("could not capture screenshot");

    firstImage.current = image;

    setCam((prev) => (prev === "user" ? "environment" : "user"));

    const wait = (t: number) => new Promise((r) => setTimeout(r, t));

    // capture second
    setTimeout(async () => {
      if (camRef.current === null) throw new Error("webcam ref is null");
      if (firstImage.current === null)
        throw new Error("could not take first image");

      let otherImage = camRef.current.getScreenshot();

      if (otherImage === null) {
        await wait(700);
        try {
          otherImage = getPicture();
        } catch (error) {
          await wait(1000);
          try {
            otherImage = getPicture();
          } catch (error) {
            throw new Error("could not take second picture");
          }
        }
      }

      setImages({
        main: cam === "user" ? otherImage : firstImage.current,
        selfie: cam === "environment" ? otherImage : firstImage.current,
      });
    }, 1000);
  };

  const getPicture = () => {
    if (camRef.current === null) throw new Error("webcam ref is null");

    const image = camRef.current.getScreenshot();
    if (image === null) throw new Error("could not capture screenshot");

    return image;
  };

  return (
    <>
      <Webcam
        ref={camRef}
        screenshotFormat="image/webp"
        height={1000}
        width={1000}
        className="absolute rounded-md aspect-[3/4] w-full"
        audio={false}
        mirrored={cam === "user"}
        videoConstraints={{ facingMode: cam, aspectRatio: 3 / 4 }}
      />
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
    </>
  );
};

export default Page;
