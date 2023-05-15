import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppWrapper from "~/components/AppWrapper";

interface getServerSideProps {
  data: {
    message: string | undefined
  };
}
const MyApp: AppType<getServerSideProps> = ({ Component, pageProps,  }) => {

  return (
    <ClerkProvider {...pageProps}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
