import { useMutation } from "@tanstack/react-query";
import { useAcross } from "@/lib/AcrossContext";
import { buildQueryKey } from "@/lib/utils";
import { AcrossClient, ExecutionProgress } from "@across-protocol/app-sdk";
import { useChainId, useChains, useConfig, useSwitchChain } from "wagmi";
import { useState } from "react";
import { TransactionReceipt } from "viem";
import { getWalletClient } from "wagmi/actions";

export type useExecuteQuoteParams =
  | Omit<Parameters<AcrossClient["executeQuote"]>[0], "walletClient">
  | undefined;

export function useExecuteQuote(params: useExecuteQuoteParams) {
  const sdk = useAcross();
  const config = useConfig();
  const chains = useChains();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
  const mutationKey = buildQueryKey("executeQuote", params);

  const [progress, setProgress] = useState<ExecutionProgress>({
    status: "idle",
    step: "approve",
  });
  const [depositReceipt, setDepositReceipt] = useState<TransactionReceipt>();
  const [fillReceipt, setFillReceipt] = useState<TransactionReceipt>();

  function resetProgress() {
    setProgress({
      status: "idle",
      step: "approve",
    });
  }
  console.log("params", params);
  const { mutate: executeQuote, ...rest } = useMutation({
    mutationKey,
    mutationFn: async () => {
      resetProgress();

      if (!params) {
        return;
      }

      if (chainId !== params.deposit.originChainId) {
        await switchChainAsync({ chainId: params.deposit.originChainId });
      }

      const walletClient = await getWalletClient(config);
      if (!walletClient) {
        return;
      }

      return sdk.executeQuote({
        ...params,
        walletClient,
        infiniteApproval: true,
        onProgress: (progress) => {
          console.log(progress);
          if (progress.status === "txSuccess" && progress.step === "deposit") {
            setDepositReceipt(progress.txReceipt);
          }
          if (progress.status === "txSuccess" && progress.step === "fill") {
            setFillReceipt(progress.txReceipt);
          }
          setProgress(progress);
        },
      });
    },
    onError: (error) => {
      console.log("ERROR", error);
    },
  });

  const originChain = chains.find(
    (chain) => chain.id === params?.deposit.originChainId,
  );

  const destinationChain = chains.find(
    (chain) => chain.id === params?.deposit.destinationChainId,
  );

//   const depositTxLink =
//     depositReceipt &&
//     originChain &&
//     getExplorerLink({
//       chain: originChain,
//       type: "transaction",
//       txHash: depositReceipt.transactionHash,
//     });

//   const fillTxLink =
//     fillReceipt &&
//     destinationChain &&
//     getExplorerLink({
//       chain: destinationChain,
//       type: "transaction",
//       txHash: fillReceipt.transactionHash,
//     });

  return {
    progress,
    executeQuote,
    depositReceipt,
    fillReceipt,
    // depositTxLink,
    // fillTxLink,
    ...rest,
  };
}
