import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '~/store'

type ConnectionStatus =
  | "NOT_CONNECTED" // user not connected to any chain
  | "CONNECTED" // user connected to Polygon chain
  | "PENDING" // user is connecting a chain
  | "WRONG_CHAIN"; // user is connected to a different chain (!= Polygon)

interface WalletState {
  address: string | null,
  connectionStatus: ConnectionStatus
}

const initialState: WalletState = {
  address: null,
  connectionStatus: "NOT_CONNECTED"
}

export const sliceName = "wallet";

export const walletSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload
    },
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload
    }
  },
})

export const { setAddress, setConnectionStatus } = walletSlice.actions

const selectWallet = (state: RootState) => state[sliceName];

export const selectAddress = createSelector(selectWallet, (wallet) => wallet.address);
export const selectConnectionStatus = createSelector(selectWallet, (wallet) => wallet.connectionStatus )

export default walletSlice.reducer