import { setCookie, destroyCookie } from "nookies";
import jwtDecode from "jwt-decode";
import { AuthTokenPairApi } from "../generated/common/types";

export function createCookiesFromTokenPair(ctx: any, tokenPair: AuthTokenPairApi) {
  const accessToken = jwtDecode(tokenPair.accessToken) as any;
  const refreshToken = jwtDecode(tokenPair.refreshToken) as any;

  setCookie(ctx, "accessToken", tokenPair.accessToken, {
    expires: new Date(accessToken.exp * 1000)
  });
  setCookie(ctx, "refreshToken", tokenPair.refreshToken, {
    expires: new Date(refreshToken.exp * 1000)
  });
}

export function removeCookies(ctx: any) {
  destroyCookie(ctx, "accessToken");
  destroyCookie(ctx, "refreshToken");
}
