import { useQuery } from "@tanstack/react-query";
import { useAcross } from "@/lib/AcrossContext";
import { AcrossClient } from "@across-protocol/app-sdk";
import { buildQueryKey } from "@/lib/utils";

export type useAvailableRoutesParams = Parameters<
  AcrossClient["getAvailableRoutes"]
>[0];

export function useAvailableRoutes(
  params: useAvailableRoutesParams,
  enabled = true,
) {
  const sdk = useAcross();

  const queryKey = buildQueryKey("availableRoutes", params);

  const { data: availableRoutes, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.getAvailableRoutes(params);
    },
    enabled,
    refetchInterval: Infinity,
  });

  return { availableRoutes, ...rest };
}