import axios, { AxiosRequestConfig } from "axios";
import jwtDecode from "jwt-decode";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { apiAuthRefreshTokens } from "../generated/auth/apiClient";
import { AuthTokenPairApi } from "../generated/common/types";

export function createCookiesFromTokenPair(ctx: any, tokenPair: AuthTokenPairApi) {
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

export function removeCookies(ctx: any) {
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
  ctx: any,
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

        createCookiesFromTokenPair(ctx, cookies);
      } catch {
        // If we can't refresh, we can safely remove the refresh token
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
