import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQueryClient } from "react-query";
import { apiAuthMe } from "../generated/auth/apiClient";
import { useAuthLogin, useAuthLogout, useAuthMe } from "../generated/auth/reactQueries";
import { axiosRefreshTokenInterceptor, createCookiesFromTokenPair, removeCookies } from "../lib/auth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  axiosInstance.interceptors.request.use(axiosRefreshTokenInterceptor(context));

  await queryClient.prefetchQuery(useAuthMe.queryKey(), () => apiAuthMe(axiosInstance));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Home() {
  const queryClient = useQueryClient();
  const isLoggedIn = useAuthMe();
  const login = useAuthLogin({
    onSuccess: data => {
      createCookiesFromTokenPair(data);
      queryClient.invalidateQueries([]);
    },
  });
  const logout = useAuthLogout({
    onSuccess: data => {
      removeCookies();
      queryClient.invalidateQueries([]);
    },
  });

  return (
    <>
      <Head>
        <title>Session handling - SSR</title>
      </Head>

      <div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
        <button onClick={() => login.mutate({})}>Login</button>
        {isLoggedIn.isError ? "Not logged in" : `Logged in since ${isLoggedIn.data?.session.createdAt}`}
        <button onClick={() => logout.mutate({})}>Logout</button>
      </div>
    </>
  );
}
