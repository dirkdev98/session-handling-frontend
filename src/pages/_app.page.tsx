import axios from "axios";
import "css/tailwind.css";
import { AppProps } from "next/app";
import React, { useRef, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ApiProvider } from "../generated/common/reactQuery";
import { axiosRefreshTokenInterceptor } from "../lib/auth";

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

  const accessTokenRefreshState = useRef<{
    isRefreshing: boolean;
    requestQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[];
  }>({
    isRefreshing: false,
    requestQueue: [],
  });

  const [axiosInstance] = useState(() => {
    const client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    client.interceptors.request.use(axiosRefreshTokenInterceptor(undefined));

    return client;
  });

  return (
    <ApiProvider instance={axiosInstance}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </ApiProvider>
  );
}

export default App;
