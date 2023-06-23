"use client";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import RotateIcon from "@/../public/assets/rotate.svg";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import uploadImages from "@/firebase/client/uploadReBeal";
import { base64ToFile } from "@/helpers/base64ToFile";
import toast from "react-simple-toasts";
import { usePathname, useRouter } from "next/navigation";
import PaperPlaneIcon from "@/../public/assets/paperPlane.svg";
import LoadingCircle from "@/components/LoadingCircle";

const Page: React.FunctionComponent = () => {
  const session = useSession();

  const [images, setImages] = useState<null | {
    environment: string;
    selfie: string;
  }>(null);

  const [uploading, setUploading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const post = async () => {
    if (images === null) return;
    if (session === null || session.data?.user.id === undefined)
      return toast("please log in", {
        clickable: true,
        onClick: () =>
          signIn(undefined, {
            callbackUrl: pathname,
          }),
      });

    const timestamp = Date.now(); // unsafe (but irrelevant for this project)

    setUploading(true);

    const [environmentURL, selfieURL] = await uploadImages(
      {
        environment: base64ToFile(images.environment, "environment.webp"),
        selfie: base64ToFile(images.selfie, "selfie.webp"),
      },
      session.data.user.id
    );

    console.log(environmentURL, selfieURL);

    fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({
        environmentURL,
        selfieURL,
        postedAt: timestamp,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast("posted ✅");
          setUploading(false);
          router.push("/app");
        }
      });
  };

  if (images === null)
    return (
      <Camera
        setImages={(images: { environment: string; selfie: string }) =>
          setImages(images)
        }
      />
    );

  return (
    <>
      <header className=" w-full max-w-3xl mt-2 p-3 flex flex-row justify-center items-center">
        <Link className="absolute left-5 text-2xl" href="/app">
          &lt;
        </Link>
        <h1 className="text-2xl">ReBeal.</h1>
        <div />
      </header>
      <div className="flex flex-col justify-around h-[calc(100%-65px)]">
        <div className="relative w-full aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rounded absolute top-4 left-4 h-40"
            src={images.environment}
            alt="main image"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rounded" src={images.selfie} alt="selfie image" />
        </div>

        <button
          className="w-full text-3xl flex items-center justify-center h-full gap-3"
          onClick={uploading ? undefined : post}
        >
          POST{" "}
          {uploading ? (
            <LoadingCircle />
          ) : (
            <Image
              height={35}
              className="invert rotate-45"
              src={PaperPlaneIcon}
              alt="paper plane (send icon)"
            />
          )}
        </button>
      </div>
    </>
  );
};

const Camera = ({
  setImages,
}: {
  setImages: (images: { environment: string; selfie: string }) => void;
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
        environment: cam === "user" ? otherImage : firstImage.current,
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
