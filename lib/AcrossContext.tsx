"use client"
import { createAcrossClient } from "@across-protocol/app-sdk";

import { createContext, useContext } from "react";
import { mainnet, optimism, arbitrum, baseSepolia, sepolia, arbitrumSepolia } from "viem/chains";

const client = createAcrossClient({
  integratorId: "0xdead", // 2-byte hex string
  chains: [mainnet, optimism, arbitrum, baseSepolia, sepolia, arbitrumSepolia],
  useTestnet: true,
});

export const AcrossContext = createContext(client);

export const useAcross = () => {
  return useContext(AcrossContext);
};

export const AcrossProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AcrossContext.Provider value={client}>{children}</AcrossContext.Provider>
  );
}
