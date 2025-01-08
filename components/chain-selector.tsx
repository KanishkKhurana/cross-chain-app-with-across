"use client"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { cn } from "@/lib/utils";
  import { AcrossChain } from "@across-protocol/app-sdk";  
  import Image from "next/image";  
  import { SelectProps } from "@radix-ui/react-select";
  import { useSupportedAcrossChains } from "@/hooks/useGetSupportedChains";
  
  export type ChainSelectProps = SelectProps & {
    chains?: AcrossChain[] | undefined;
    chain?: AcrossChain["chainId"] | undefined;
    onChainChange?: (_chainId: AcrossChain["chainId"]) => void;
    className?: string;
    id?: string;
  };
  
  
  export default function ChainSelector({
      chains ,
      chain,
      onChainChange,
      id,
      className,
      ...props
    }: ChainSelectProps) {
        const { supportedChains } = useSupportedAcrossChains({});
        console.log(supportedChains)
        // if (!chains) {
    //   return (
    //     <Skeleton
    //       className={cn(
    //         "flex h-10 w-full items-center justify-between rounded-md border border-border-secondary bg-background px-3 py-2 text-sm ",
    //         className,
    //       )}
    //     />
    //   );
    // }


    return (
        <Select
        onValueChange={(value) => onChainChange(parseInt(value))}
        value={chain?.toString()}
        {...props}
      >
        <SelectTrigger id={id} className={cn("w-full", className)}>
          <SelectValue placeholder="Select a Chain" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select a Chain</SelectLabel>
            {/* <Divider className="my-3" /> */}
            {supportedChains?.map((chain) => (
              <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                <div className="flex gap-2 items-center">
                  <Image
                    alt={`logo for ${chain.name}`}
                    src={chain.logoUrl}
                    width={24}
                    height={24}
                  />
                  <p> {chain.name}</p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }