import { useEffect, useState } from 'react'
import { erc20Abi, parseEther } from 'viem'
import { useReadContract, useSimulateContract } from 'wagmi'

export default function useFeeOnTransfer(tokenAddress: `0x${string}`, userAddress: `0x${string}`) {
  const [isFeeOnTransfer, setIsFeeOnTransfer] = useState(false)

  const smallAmount = parseEther('0.0001')

  const { data: balanceBefore } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  const { data: tfResult } = useSimulateContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'transfer',
    args: [userAddress, smallAmount],
  })

  const { data: balanceAfter } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  useEffect(() => {
    if (balanceBefore && balanceAfter) {
      setIsFeeOnTransfer(balanceAfter + smallAmount < balanceBefore)
    }
  }, [smallAmount, balanceBefore, balanceAfter])

  return isFeeOnTransfer
}
