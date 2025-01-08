import { useQuery } from "@tanstack/react-query";
import { useAcross } from "@/lib/AcrossContext";

import { AcrossClient } from "@across-protocol/app-sdk";
import { buildQueryKey } from "@/lib/utils";

export type useAcrossChainsParams = Parameters<
  AcrossClient["getSupportedChains"]
>[0];

export function useSupportedAcrossChains(params: useAcrossChainsParams) {
  const sdk = useAcross();
  const queryKey = buildQueryKey("supportedChains", params);

  const { data: supportedChains, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.getSupportedChains(params);
    },
    enabled: true,
    refetchInterval: Infinity,
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return { supportedChains, ...rest };
}
