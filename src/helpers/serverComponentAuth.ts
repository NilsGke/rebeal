import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthRequiredError } from "@/helpers/authRequiredException";

const serverAuth = async () => {
  const session = await getServerSession(authOptions);
  if (session === null || session.user === undefined)
    throw new AuthRequiredError();
  return session;
};
export default serverAuth;
