import useTranscationState from '@/app/hooks/useTranscationState'
import { Currency } from '@/constants/currency'
import { splitCurrencyType } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { erc20Abi, formatEther, parseEther } from 'viem'
import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Button } from '@/components/ui/button'

export default function useApprove(
  tokenAddress: `0x${string}` | undefined,
  spender: `0x${string}`,
  amount: string | bigint | undefined,
) {
  const amt = amount ? (typeof amount === 'string' ? parseEther(amount) : amount) : BigInt(0)

  const { data: approvePayload } = useSimulateContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'approve',
    args: [spender, amt],
    query: {
      enabled: !!amt,
    },
  })

  const { writeContractAsync, isPending: isApproving, data: txHash } = useWriteContract()

  const { isSuccess: isApproveTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const isApprovePayload = !!approvePayload?.request

  const handleOnApprove = () => {
    const approve = writeContractAsync(approvePayload!.request)

    toast.promise(approve, {
      loading: 'Approving',
      success: () => `Approving In progress, please wait...`,
      error: `Approving error`,
      description: `Amount: ${formatEther(amt).split('.')[0]}`,
      className: 'rounded-lg',
    })
  }

  return { isApprovePayload, handleOnApprove, isApproving, isApproveTxSuccess }
}
