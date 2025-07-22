import { create } from 'zustand'

type TUser = {
  id: string
  name: string
  email: string
  image: string | null
}

type TAuthStoreState = {
  user: TUser | null
  loading: boolean
  setUser: (user: TUser | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<TAuthStoreState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))
