const getDicebearImage = (name: string) =>
  `https://api.dicebear.com/5.x/initials/png?seed=${encodeURI(name)}`;

export default getDicebearImage;
