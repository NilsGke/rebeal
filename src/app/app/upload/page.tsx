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
import CloseIcon from "@/../public/assets/closeIcon.svg";
import ReBealImageViewer from "@/components/RebealImageViewer";
import BackButton from "@/../public/assets/backArrow.svg";

const Page: React.FunctionComponent = () => {
  const session = useSession();

  const [images, setImages] = useState<null | {
    environment: string;
    selfie: string;
  }>(null);

  const [status, setStatus] = useState<
    "idle" | "uploading" | "posted" | "failed"
  >("idle");

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

    const timestamp = Date.now();

    setStatus("uploading");

    const [environmentURL, selfieURL] = await uploadImages(
      {
        environment: base64ToFile(images.environment, "environment.webp"),
        selfie: base64ToFile(images.selfie, "selfie.webp"),
      },
      session.data.user.id
    ).catch((error) => {
      setStatus("failed");
      console.error(error);
      toast(error);
      return [null, null];
    });

    if (environmentURL === null || selfieURL === null) return;

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
          setStatus("posted");
          router.push(`/app?t=${Date.now()}`);
        }
      })
      .catch((error) => {
        setStatus("failed");
        toast(error);
        console.error(error);
      });
  };

  return (
    <>
      <Link href="/app" className="absolute top-6 left-5 z-10 ">
        <Image
          className="invert aspect-square w-6"
          src={BackButton}
          alt="close icon"
        />
      </Link>

      {images === null ? (
        <Camera
          setImages={(images: { environment: string; selfie: string }) =>
            setImages(images)
          }
        />
      ) : (
        <>
          <header className=" w-full max-w-3xl mt-2 p-3 flex flex-row justify-center items-center">
            <h1 className="text-2xl">ReBeal.</h1>
            <button
              className="invert absolute right-5 h-7 w-7 aspect-square"
              onClick={() => setImages(null)}
            >
              <Image
                src={CloseIcon}
                className="h-[80%] w-[80%]"
                alt="close icon"
              />
            </button>
          </header>
          <div className="flex flex-col justify-around h-[calc(100%-65px)]">
            <div className="relative w-full aspect-[3/4]">
              <ReBealImageViewer images={images} />
            </div>

            <button
              className="w-full text-3xl flex items-center justify-center h-full gap-3"
              onClick={
                status === "uploading" || status === "posted" ? undefined : post
              }
            >
              POST{" "}
              {status === "uploading" ? (
                <LoadingCircle />
              ) : status === "posted" ? (
                "✅"
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
      )}
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

      await wait(500);
      let otherImage = camRef.current.getScreenshot();

      if (otherImage === null) {
        await wait(500);
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
        className="mt-[15%] rounded-md aspect-[3/4] w-full max-w-full"
        audio={false}
        mirrored={cam === "user"}
        videoConstraints={{ facingMode: cam, aspectRatio: 4 / 3 }}
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
