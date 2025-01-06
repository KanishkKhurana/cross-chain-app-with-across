import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    coinbaseWallet(),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
})