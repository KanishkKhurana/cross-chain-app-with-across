'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { WalletMinimal } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function WalletButton(){
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
      {/* <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name} + {connector.id}  {"  \n "}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div> */}
      <ConnectButton chainStatus={"none"} accountStatus={"avatar"}/>    
    </>
  )
}

