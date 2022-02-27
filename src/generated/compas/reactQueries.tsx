// Generated by @compas/code-gen
/* eslint-disable no-unused-vars */

import { useApi, AppErrorResponse } from "../common/reactQuery";
import {
QueryKey,
UseMutationOptions,
UseMutationResult,
UseQueryOptions,
UseQueryResult,
useMutation,
useQuery,
useQueryClient,
} from "react-query";
import * as T from "../common/types";
import {
apiCompasStructure,



} from "./apiClient";



/**
 * Return the full generated structure as a json object.
 *  
 * Tags: _compas
*/
export function useCompasStructure<TData = T.CompasStructureResponseApi>(opts?: {
options?: UseQueryOptions<T.CompasStructureResponseApi, AppErrorResponse, TData> | undefined,
}|undefined) {
const axiosInstance = useApi();
const options = opts?.options ?? {};
return useQuery(useCompasStructure.queryKey(
),
({ signal }) => {
return apiCompasStructure(
axiosInstance,
{ signal },
);
},
options,
);
}
/**
 * Base key used by useCompasStructure.queryKey()
*/
useCompasStructure.baseKey = (): QueryKey => ["compas", "structure"];
/**
 * Query key used by useCompasStructure
*/
useCompasStructure.queryKey = (
): QueryKey => [
...useCompasStructure.baseKey(),
];
