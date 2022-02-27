// Generated by @compas/code-gen
/* eslint-disable no-unused-vars */

import * as T from "../common/types";
import { AxiosInstance } from "axios";



/**
 *  
*
*/
export async function apiAuthLogin(
instance: AxiosInstance,
requestConfig: { signal?: AbortSignal|undefined } = {},
): Promise<T.AuthTokenPairApi> {
const response = await instance.request({
url: `auth/login`,
method: "post",
...requestConfig,
});
return response.data;
}



/**
 *  
*
*/
export async function apiAuthLogout(
instance: AxiosInstance,
requestConfig: { signal?: AbortSignal|undefined } = {},
): Promise<T.AuthLogoutResponseApi> {
const response = await instance.request({
url: `auth/logout`,
method: "post",
...requestConfig,
});
return response.data;
}



/**
 *  
*
*/
export async function apiAuthMe(
instance: AxiosInstance,
requestConfig: { signal?: AbortSignal|undefined } = {},
): Promise<T.AuthMeResponseApi> {
const response = await instance.request({
url: `auth/me`,
method: "get",
...requestConfig,
});
return response.data;
}



/**
 *  
*
*/
export async function apiAuthRefreshTokens(
instance: AxiosInstance,
body: T.AuthRefreshTokensBodyInput,
requestConfig: { signal?: AbortSignal|undefined } = {},
): Promise<T.AuthTokenPairApi> {
const data = body;
const response = await instance.request({
url: `auth/refresh`,
method: "post",
data,
...requestConfig,
});
return response.data;
}
