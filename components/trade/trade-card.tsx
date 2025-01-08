"use client"
import React, { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { useDebounceValue } from "usehooks-ts";

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ChainSelector from "@/components/chain-selector"
import { useGetOriginTokens } from "@/hooks/useGetOriginTokens"
import { useGetDestinationTokens } from "@/hooks/useGetDestinationTokens"
import { TokenSelector } from "../token-selector"
import { useGetQuote } from "@/hooks/useGetQuote";
import { useAvailableRoutes } from "@/hooks/useGetAvailableRoutes"
import { TokenInfo } from "@across-protocol/app-sdk"
import { useAccount, useBalance } from "wagmi"
import { useSupportedAcrossChains } from "@/hooks/useGetSupportedChains"
import { formatUnits, parseUnits } from "viem"
import { useExecuteQuote } from "@/hooks/useExecuteQuote"
import { Span } from "next/dist/trace"


export default function TradeCard() {
    const [originChain, setOriginChain] = useState<number>(8453)
    const [destinationChain, setDestinationChain] = useState<number>(42_161)
    const { OriginTokens } = useGetOriginTokens(originChain);
    const { DestinationTokens } = useGetDestinationTokens(destinationChain);
    const [originToken, setOriginToken] = useState<TokenInfo | undefined>(
        OriginTokens?.[0],
      );
    const [destinationToken, setDestinationToken] = useState(DestinationTokens?.[0] || undefined);

    const { address } = useAccount();
    // const chains = useChains();
    // CHAINS
    const { supportedChains } = useSupportedAcrossChains({});
    console.log(supportedChains)
  
    // use only token data for chains we support
    // const acrossChains = useAcrossChains();
  
    // Optimism default input chain
    const defaultOriginChainId = 8453;
    const [originChainId, setOriginChainId] = useState<number | undefined>(
      defaultOriginChainId,
    );
  
    // FROM TOKEN
    // const { OriginTokens } = useGetOriginTokens(originChain);
  
    const [fromToken, setFromToken] = useState<TokenInfo | undefined>(
      OriginTokens?.[0],
    );
  
    const { data: fromTokenBalance } = useBalance({
      address,
      token: originToken
        ? undefined
        : fromToken?.address,
      chainId: originChainId,
    });
  
    const [destinationChainId, setDestinationChainId] = useState<
      number | undefined
    >(supportedChains?.find((chain) => chain.chainId !== originChainId)?.chainId);
  
    const { availableRoutes } = useAvailableRoutes({
      originChainId:originChain,
      destinationChainId:destinationChain,
      originToken: fromToken?.address,
      destinationToken: destinationToken?.address,
    });
    console.log("available routes: ",availableRoutes)
  
    const outputTokensForRoute = availableRoutes?.map((route) =>
      route.outputToken.toLowerCase(),
    );
    console.log(outputTokensForRoute)
  
    const { DestinationTokens: outputTokensForChain } =
      useGetDestinationTokens(destinationChain);
  
    const [outputTokens, setOutputTokens] = useState<TokenInfo[] | undefined>(DestinationTokens);
  
    useEffect(() => {
      const _outputTokens = outputTokensForChain?.filter((token) =>
        outputTokensForRoute?.includes(token.address.toLowerCase()),
      );
      setOutputTokens(_outputTokens);

    }, [availableRoutes]);
  
    const [toToken, setToToken] = useState<TokenInfo | undefined>(
      outputTokens?.[0],
    );
  
    useEffect(() => {
      if (outputTokens) {
        setToToken(
          outputTokens.find((token) => token.symbol === fromToken?.symbol) ??
            outputTokens?.[0],
        );
      }
    }, [DestinationTokens]);
  
    const [inputAmount, setInputAmount] = useState<string>("");
    console.log(inputAmount)
    // const [debouncedInputAmount] = useDebounceValue(inputAmount, 300);
    const route = availableRoutes?.find((route) => {
      return (
        // route.outputToken.toLocaleLowerCase() ===
        //   destinationToken?.address?.toLowerCase() &&
        route.outputTokenSymbol === destinationToken?.symbol
      );
    });
    console.log("route is: ",route)
  
    const quoteConfig =
      route && fromToken
    //   route && debouncedInputAmount && fromToken
        ? {
            route,
            recipient: address,
            inputAmount: parseUnits(inputAmount, fromToken?.decimals),
          }
        : undefined;
        console.log("quoteconfig", quoteConfig)
  
        
        const {
          quote,
          isLoading: quoteLoading,
          isRefetching,
        } =  useGetQuote(quoteConfig);
        console.log(quote?.deposit.outputAmount)
        const isQuoteReady = quote && quote.deposit && quote.deposit.outputAmount;
        console.log("quote is ready: ",isQuoteReady)
        var myinteger;

        if(quote && toToken){

            myinteger = parseFloat(formatUnits(quote?.deposit?.outputAmount , toToken?.decimals)).toFixed(4)
            console.log(myinteger)
        }


    
  
    const {
      executeQuote,
      progress,
      error,
      isPending,
      depositReceipt,
      fillReceipt,
    } = useExecuteQuote(quote);
    const inputBalance = fromTokenBalance
      ? parseFloat(
          formatUnits(fromTokenBalance?.value, fromTokenBalance?.decimals),
        ).toFixed(4)
      : undefined;
  
    function onMax() {
      if (!fromTokenBalance?.value) return;
      setInputAmount(
        formatUnits(fromTokenBalance?.value, fromTokenBalance?.decimals),
      );
    }
    // const originChain = chains.find((chain) => chain.id === originChainId);
    // const destinationChain = chains.find(
    //   (chain) => chain.id === destinationChainId,
    // );
  
    // const depositTxLink =
    //   depositReceipt &&
    //   originChain &&
    //   getExplorerLink({
    //     chain: originChain,
    //     type: "transaction",
    //     txHash: depositReceipt.transactionHash,
    //   });
  
    // const fillTxLink =
    //   fillReceipt &&
    //   destinationChain &&
    //   getExplorerLink({
    //     chain: destinationChain,
    //     type: "transaction",
    //     txHash: fillReceipt.transactionHash,
    //   });


  return (
    <Card className="w-[350px]">

      <CardContent className="mt-6">
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
                <div>
              <Label htmlFor="name">You give</Label>
              <Input id="name" placeholder="0" type="number" value={inputAmount} onChange={(event) => setInputAmount(event.target.value)} />
                </div>
                <div className="flex ">
                <ChainSelector chain={originChain} onChainChange={(val)=>(setOriginChain(val), console.log(val))} />

                <TokenSelector
              className="flex-[3]"
              tokens={OriginTokens}
              onTokenChange={(token) => (setOriginToken(token), setFromToken(token))}
              token={originToken}
            />

              {/* <Select>
                <SelectTrigger id="token">
                <SelectValue placeholder="Select Token" />
                </SelectTrigger>
                <SelectContent position="popper">
                <SelectItem value="next">ETH</SelectItem>
                <SelectItem value="sveltekit">USDC</SelectItem>
                <SelectItem value="astro">USDT</SelectItem>
                <SelectItem value="nuxt">ACX</SelectItem>
                </SelectContent>
                </Select> */}

                </div>
            </div>
            <div className="flex flex-col space-y-1.5">
                <div>
              <Label htmlFor="name">You Get</Label>
              
                <ChainSelector chain={destinationChain} onChainChange={(val)=>(setDestinationChain(val), console.log(val))} />

                <TokenSelector
              className="flex-[3]"
              tokens={DestinationTokens}
              onTokenChange={(token) => setDestinationToken(token)}
              token={destinationToken}
            />
                {/* </div>
                <div className="flex ">
                <Select>
                <SelectTrigger id="token">
                  <SelectValue placeholder="Select Network" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Mainnet</SelectItem>
                  <SelectItem value="sveltekit">Sepolia</SelectItem>
                  <SelectItem value="astro">Base</SelectItem>
                  <SelectItem value="nuxt">Polygon</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger id="token">
                  <SelectValue placeholder="Select Token" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">ETH</SelectItem>
                  <SelectItem value="sveltekit">USDC</SelectItem>
                  <SelectItem value="astro">USDT</SelectItem>
                  <SelectItem value="nuxt">ACX</SelectItem>
                </SelectContent>
              </Select>


              */}
                </div> 
              <Input id="name" placeholder="0" type="number" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardContent className="mt-6">
      <Label>Receive</Label>
                    {availableRoutes?.length === 0 && <span>("No available routes")</span>}

        {!quote && quoteLoading && (
        //   <Skeleton className="text-md font-normal text-text/80"> {/* </Skeleton> */}
             <span>"Loading quote..."</span>
        )}
        {quote && toToken && (
          <p className="text-md font-normal text-text">
{myinteger}
    
          </p>
        )}
        <Button
          onClick={() => executeQuote()}
        //   disabled={!(quote && toToken) || isRefetching || isPending}
          className="mt-2"          
        >
          {isPending
            ? "Executing..."
            : isRefetching
              ? "Updating quote..."
              : "Confirm Transaction"}
        </Button>

        {progress && (
            <div>
                
          <span>{progress.status} </span>
          <span>{progress.step} </span>
            </div>
        )}
        </CardContent>
      <CardFooter className="flex justify-between w-full ">
        {/* <Button variant="outline">Cancel</Button> */}
        <Button className="w-full">Swap</Button>
      </CardFooter>
    </Card>
  )
}
