export const storeFrontCamera = (id: MediaDeviceInfo["deviceId"]) =>
  localStorage.setItem("frontCameraId", id);
export const storeBackCamera = (id: MediaDeviceInfo["deviceId"]) =>
  localStorage.setItem("backCameraId", id);

export const getFrontCamera = (): MediaDeviceInfo["deviceId"] | null =>
  localStorage.getItem("frontCameraId");
export const getBackCamera = (): MediaDeviceInfo["deviceId"] | null =>
  localStorage.getItem("backCameraId");

export const deleteCams = () => {
  localStorage.removeItem("frontCameraId");
  localStorage.removeItem("backCameraId");
};
