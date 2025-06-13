
import { mainnet, sepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'My DeFi App',
  projectId: 'b2a6ede42eec640308341b44e2ec7ffc',
  chains: [sepolia, mainnet],
  ssr: false,
})
