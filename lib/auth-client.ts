import useSWR from 'swr'

const fetcher = async () => {
  try {
    return await fetch('http://localhost:8080/auth/session')
      .then((res) => res.json())
      .then((data) => data.user)
  } catch {
    return null
  }
}

export const useSession = () => {
  const {
    data: user,
    isLoading: isPending,
    error,
  } = useSWR('profile', fetcher, {
    revalidateOnFocus: false,
  })
  return { data: { user }, isPending, error }
}
