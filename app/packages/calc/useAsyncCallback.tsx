import { useAsyncCallback as useAsyncCallbackBase, UseAsyncCallbackOptions } from 'react-async-hook'
import Toast from 'react-native-toast-message'

export type ExtendedOptions<R> = UseAsyncCallbackOptions<R> & {
  logError?: boolean
  errorTitle?: string
  successTitle?: string
}

export function useAsyncCallback<R = unknown, Args extends any[] = any[]>(asyncFunction: (...args: Args) => Promise<R> | R, options?: ExtendedOptions<R>) {
  const { onError, errorTitle, successTitle, ...baseOptions } = options || {}
  return useAsyncCallbackBase(async (...params: Args) => {
    const res = await asyncFunction(...params)
    if (successTitle) {
      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: successTitle
      })
    }
    return res
  }, {
    ...baseOptions,
    onError: (e: any, options) => {
      if (onError) onError(e, options)

      console.error(e)

      Toast.show({
        position: 'bottom',
        type: 'error',
        text1: errorTitle ?? e.message
      })
    }
  })
}
