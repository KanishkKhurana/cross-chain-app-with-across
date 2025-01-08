import { useQuery } from "@tanstack/react-query";
import { useAcross } from "@/lib/AcrossContext";
import { AcrossClient } from "@across-protocol/app-sdk";
import { buildQueryKey } from "@/lib/utils";

export type useQuoteParams =
  | Pick<Parameters<AcrossClient["getQuote"]>[0], "inputAmount" | "route">
  | undefined;

export function useGetQuote(
  params: useQuoteParams,
  query?: Parameters<typeof useQuery>[1],
) {
  const sdk = useAcross();
  const queryKey = buildQueryKey("getQuote", params);

  const { data: quote, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!params) return;
      return await sdk.getQuote(params);
    },
    enabled: Boolean(params),
    refetchInterval: 10_000,
    retryDelay(failureCount, error) {
      return 10_000;
    },
    retry: (_, error) => {
      console.log(error);
      return true;
    },
    ...query,
  });
  console.log("quote is: ",quote);

  return { quote, ...rest };
}