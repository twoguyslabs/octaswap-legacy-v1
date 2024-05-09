import { ChainId } from './chainId'

enum Wrapped {
  OCTA = '0x05f1f289A97B2b4032e76c6de4aD746f02F20d9A',
}

const CHAIN_ID_TO_WRAPPED = {
  [ChainId.OCTA_SPACE]: Wrapped.OCTA,
}

export { CHAIN_ID_TO_WRAPPED }
