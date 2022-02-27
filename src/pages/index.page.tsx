import Head from "next/head";
import { useQueryClient } from "react-query";
import { useAuthLogin, useAuthLogout, useAuthMe } from "../generated/auth/reactQueries";
import { createCookiesFromTokenPair, removeCookies } from "../lib/cookies";

export default function Home() {
  const queryClient = useQueryClient();
  const isLoggedIn = useAuthMe();
  const login = useAuthLogin({
    onSuccess: data => {
      createCookiesFromTokenPair(undefined, data);
      queryClient.invalidateQueries([]);
    },
  });
  const logout = useAuthLogout({
    onSuccess: data => {
      removeCookies(undefined);
      queryClient.invalidateQueries([]);
    },
  });

  return (
    <>
      <Head>
        <title>Session handling</title>
      </Head>

      <div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
        <button onClick={() => login.mutate({})}>Login</button>
        {isLoggedIn.isError ? "Not logged in" : `Logged in since ${isLoggedIn.data?.session.createdAt}`}
        <button onClick={() => logout.mutate({})}>Logout</button>
      </div>
    </>
  );
}
