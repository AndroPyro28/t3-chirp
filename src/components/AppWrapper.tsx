import { api } from "~/utils/api";
import Loader from "./Loader";
import { useEffect } from "react";
import router from "next/router";

const AppWrapper = ({children}:any) => {
    // const {data, isError, isLoading} = api.auth.sampleAuth.useQuery(undefined, {
    //     retry: (_count, err) => {
    //       // `onError` only runs once React Query stops retrying
    //       if (err.data?.code === "UNAUTHORIZED") {
    //         return false;
    //       }
    //       return true;
    //     },
    //     onError: (err) => {
    //       if (err.data?.code === "UNAUTHORIZED") {
    //         void router.push('/');
    //       }
    //     },
    //     onSuccess: (data) => {
    //     }
    // })

    // console.log(data)

    return children
}


export default AppWrapper;