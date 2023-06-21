export type UserDoc = {
  image: string;
  emailVerified: boolean;
  name: string;
  email: string;
  id: string;
};

export const isUserDoc = (doc: any): doc is UserDoc => {
  try {
    if (
      doc.hasOwnProperty("image") &&
      doc.hasOwnProperty("emailVerified") &&
      doc.hasOwnProperty("name") &&
      doc.hasOwnProperty("email") &&
      doc.hasOwnProperty("id")
    )
      return true;
    else return false;
  } catch (error) {
    return false;
  }
};
