import { useQuery } from "@tanstack/react-query";
import { useAcross } from "@/lib/AcrossContext";

export function useGetDestinationTokens(destinationChainId: number | 421_614) {
  const sdk = useAcross();
  const queryKey = ["DestinationTokens", destinationChainId];

  const { data: chains, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.getSupportedChains({ chainId: destinationChainId });
    },
    enabled: Boolean(destinationChainId),
    refetchInterval: Infinity,
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return {
    DestinationTokens: chains?.[0] ? chains[0].outputTokens : undefined,
    ...rest,
  };
}