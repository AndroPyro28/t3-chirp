import { GetServerSideProps } from "next";
const anotherGetServerSideProps: GetServerSideProps = async (context) => {
    console.log('execute anotherGetServerSideProps')

    
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
export default anotherGetServerSideProps;
