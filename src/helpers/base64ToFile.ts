export const base64ToFile = (dataurl: string, filename: string) => {
  var arr = dataurl.split(","),
    match = arr[0].match(/:(.*?);/);
  if (match === null)
    throw new Error("dataurl does not seem to be a base64 file");
  var mime = match[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
