import { NextPage } from "next";
 export { default as getServerSideProps } from "~/utils/getServerSideProps"; // will run
 type Props = {
    post: string;
    user: string;
 }
   
 const index: NextPage<Props> = (props: Props) => {
   console.log({ props });
   return (
     <div>
     </div>
   );
 };
 export default index;
