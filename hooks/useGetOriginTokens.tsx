import { useQuery } from "@tanstack/react-query";
import { useAcross } from "@/lib/AcrossContext";

export function useGetOriginTokens(originChainId: number | 11_155_111) {
  const sdk = useAcross();
  const queryKey = ["OriginTokens", originChainId];

  const { data: chains, ...rest } = useQuery({
    queryKey,
    queryFn: () => {
      return sdk.getSupportedChains({ chainId: originChainId });
    },
    enabled: Boolean(originChainId),
    refetchInterval: Infinity,
    retry: (_, error) => {
      console.log(error);
      return true;
    },
  });

  return {
    OriginTokens: chains?.[0] ? chains[0].inputTokens : undefined,
    ...rest,
  };
}