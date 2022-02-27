import axios from "axios";
import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import "css/tailwind.css";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { parseCookies } from "nookies";
import { ApiProvider } from "../generated/common/reactQuery";

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10000,
            retry: false,
          },
        },
      }),
  );

  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });

  useEffect(() => {
    client.interceptors.request.use(value => {
      const cookies = parseCookies(undefined);

      if (cookies.accessToken) {
        value.headers = value.headers ?? {};
        value.headers["Authorization"] = `Bearer ${cookies.accessToken}`;
      }

      return value;
    });
  }, [client]);

  return (
    <ApiProvider instance={client}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </ApiProvider>
  );
}

export default App;
