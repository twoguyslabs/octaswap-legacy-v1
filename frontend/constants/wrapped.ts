import { ChainId } from './chainId'

enum Wrapped {
  FOUNDRY = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  OCTA = '0x05f1f289A97B2b4032e76c6de4aD746f02F20d9A',
}

const NATIVE_TO_WRAPPED = {
  [ChainId.FOUNDRY]: Wrapped.FOUNDRY,
  [ChainId.OCTA_SPACE]: Wrapped.OCTA,
}

export { NATIVE_TO_WRAPPED }
