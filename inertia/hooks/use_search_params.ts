import { router, usePage } from '@inertiajs/react'

export const useSearchParams = () => {
  const { url } = usePage()
  const queryString = url.split('?')[1] || ''
  const searchParams = new URLSearchParams(queryString)
  const pathname = new URL(url, 'http://dummy-base').pathname

  const updateSearchParams = (queryParams: Record<string, string | number | undefined>) => {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value === undefined) {
        searchParams.delete(key)
      } else {
        searchParams.set(key, String(value))
      }
    })

    router.get(pathname, Object.fromEntries(searchParams), {
      preserveState: true,
      preserveScroll: false,
      replace: true,
    })
  }

  return { searchParams, updateSearchParams }
}
