import { GetServerSideProps } from "next";
import { api } from "./api";

const getSomeStuff = ( ) => {
  const {data} = api.auth.sampleAuth.useQuery();
return data;
}
const getServerSideProps: GetServerSideProps = async (context) => {

  const session = {
    user: {
      name: "John Doe",
      email: "doe@gmail.com",
      image: "src",
    },
    expires: "2",
  };
  if (!session) {
    return {
        redirect: {
            destination: "/login",
            permanent: false,
          }
    }
    }
  return {
    props: {
        post: "post",
        user: session.user,
    }
  };
};
export default getServerSideProps;
