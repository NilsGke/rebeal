import { FC } from "react";

const Page: FC<{
  params: {
    username: string;
  };
}> = ({ params }) => {
  const user = decodeURI(params.username);
  return <div className="">{user}</div>;
};
export default Page;
