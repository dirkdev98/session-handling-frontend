import axios, { AxiosRequestConfig } from "axios";
import jwtDecode from "jwt-decode";
import { GetServerSidePropsContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { apiAuthRefreshTokens } from "../generated/auth/apiClient";
import { AuthTokenPairApi } from "../generated/common/types";

/**
 * Use nookies to create cookies from the provided token pair.
 * The `ctx` can be `undefined` when this runs in the browser.
 * It decodes the tokens, so the cookies expire when the tokens expire.
 */
export function createCookiesFromTokenPair(tokenPair: AuthTokenPairApi, ctx?: GetServerSidePropsContext) {
  const accessToken = jwtDecode(tokenPair.accessToken) as any;
  const refreshToken = jwtDecode(tokenPair.refreshToken) as any;

  setCookie(ctx, "accessToken", tokenPair.accessToken, {
    expires: new Date(accessToken.exp * 1000),
    secure: process.env.NODE_ENV === "production",
  });
  setCookie(ctx, "refreshToken", tokenPair.refreshToken, {
    expires: new Date(refreshToken.exp * 1000),
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Remove the access and refresh token cookies
 */
export function removeCookies(ctx?: GetServerSidePropsContext) {
  destroyCookie(ctx, "accessToken");
  destroyCookie(ctx, "refreshToken");
}

/**
 * Interceptor managing added accces tokens to api calls.
 * If no access token is found, but a refresh token is available, it goes in to the refresh
 * state;
 * - Temporarily adds all new requests to a queue
 * - Calls the refresh tokens endpoint
 *    - If fails, removes the refresh token and just let's all other requests go through
 *    - If successfully, runs all requests in the queue and resolves the current request
 */
export function axiosRefreshTokenInterceptor(
  ctx?: GetServerSidePropsContext,
): (config: AxiosRequestConfig) => Promise<AxiosRequestConfig> {
  let isRefreshing = false;
  const queueWhileRefreshing: (() => AxiosRequestConfig)[] = [];

  const interceptor = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    let cookies: AuthTokenPairApi = parseCookies(ctx) as any;

    if (isRefreshing) {
      return new Promise(r => {
        queueWhileRefreshing.push(r as any);
      }).then(() => interceptor(config));
    }

    if (!cookies.accessToken && cookies.refreshToken) {
      isRefreshing = true;

      try {
        cookies = await apiAuthRefreshTokens(axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL }), {
          refreshToken: cookies.refreshToken,
        });

        createCookiesFromTokenPair(cookies, ctx);
      } catch {
        // If we can't refresh, we can safely remove the refresh token
        // This way this refresh logic isn't triggered for any subsequent requests
        removeCookies(ctx);
      }

      isRefreshing = false;
      while (queueWhileRefreshing.length) {
        queueWhileRefreshing.pop()?.();
      }
    }

    if (cookies.accessToken) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${cookies.accessToken}`;
    }

    return config;
  };

  return interceptor;
}
