"use client";

import {
  deleteCams,
  getBackCamera,
  getFrontCamera,
  storeBackCamera,
  storeFrontCamera,
} from "@/helpers/cameraIdStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import Webcam from "react-webcam";

const CameraLoader = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null);

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  if (devices === null)
    return (
      <div className="w-full h-full flex justify-center items-center">
        loading your cameras...
      </div>
    );

  return <Page devices={devices} />;
};

interface PageProps {
  devices: MediaDeviceInfo[];
}

const Page: React.FunctionComponent<PageProps> = ({ devices }) => {
  const [frontCameraId, setFrontCamera] = useState(getFrontCamera());
  const [backCameraId, setBackCamera] = useState(getBackCamera());

  const query = useSearchParams();
  const callback = query.get("callback");

  const router = useRouter();

  useEffect(() => {
    if (callback) router.prefetch(callback);
  }, [router, callback]);

  return (
    <div className="h-full">
      {frontCameraId === null || backCameraId === null ? (
        <>
          <CameraSelector
            devices={devices}
            setFrontCamera={(id) => {
              storeFrontCamera(id);
              setFrontCamera(id);
            }}
            setBackCamera={(id) => {
              storeBackCamera(id);
              setBackCamera(id);
              if (callback) router.replace(callback);
            }}
          />
        </>
      ) : (
        <div>
          <h2>Front Camera</h2>
          <Webcam
            audio={false}
            videoConstraints={{ deviceId: frontCameraId }}
          />
          <h2>Back Camera</h2>
          <Webcam
            audio={false}
            videoConstraints={{
              deviceId: backCameraId,
            }}
          />
          <button
            className="p-3 rounded border-2 hover:bg-white hover:text-black transition"
            onClick={() => {
              deleteCams();
              setFrontCamera(null);
              setBackCamera(null);
            }}
          >
            reset
          </button>
        </div>
      )}
    </div>
  );
};

const CameraSelector = ({
  devices,
  setFrontCamera,
  setBackCamera,
}: {
  devices: MediaDeviceInfo[];
  setFrontCamera: (id: MediaDeviceInfo["deviceId"]) => void;
  setBackCamera: (id: MediaDeviceInfo["deviceId"]) => void;
}) => {
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [select, setSelect] = useState<"back" | "selfie">("selfie");

  if (devices.length < 2) return <div>you dont have enough cameras :(</div>;

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1>Select your {select} camera</h1>
      <div className="p-4 h-fit w-fit">
        <Webcam
          className="rounded h-full"
          videoConstraints={{ deviceId: devices[currentDeviceIndex].deviceId }}
        />
      </div>
      <div className="flex flex-row justfy-center gap-5">
        <button
          onClick={() =>
            setCurrentDeviceIndex((prev) =>
              prev === 0 ? devices.length - 1 : prev - 1
            )
          }
          className="p-2 h-10 bg-zink-800 rounded border-2 aspect-square flex justify-center items-center hover:bg-white hover:text-black transition"
        >
          &lt;
        </button>
        <button
          onClick={() => {
            if (select === "selfie") {
              console.log("store selfie");

              setFrontCamera(devices[currentDeviceIndex].deviceId);
              setSelect("back");
              setCurrentDeviceIndex((prev) =>
                prev + 1 >= devices.length ? 0 : prev + 1
              );
            } else setBackCamera(devices[currentDeviceIndex].deviceId);
          }}
          className="p-2 h-10 bg-zink-800 rounded border-2 flex justify-center items-center hover:bg-white hover:text-black transition"
        >
          This is my {select} cam
        </button>
        <button
          onClick={() =>
            setCurrentDeviceIndex((prev) =>
              prev + 1 >= devices.length ? 0 : prev + 1
            )
          }
          className="p-2 h-10 bg-zink-800 rounded border-2 aspect-square flex justify-center items-center hover:bg-white hover:text-black transition"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CameraLoader;
