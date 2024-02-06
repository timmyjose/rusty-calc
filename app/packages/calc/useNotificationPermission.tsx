import { useEffect, useState } from 'react'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useAsyncCallback } from 'useAsyncCallback'
// import { useAsync } from 'react-async-hook'

export enum NotificationPermission {
  UNKNOWN = "UNKNOWN",
  ENABLED = "ENABLED",
  DENIED = "DENIED"
}

const isEnabled = (authStatus: FirebaseMessagingTypes.AuthorizationStatus): NotificationPermission => {
  console.log('authStatus = ', authStatus)

  switch (authStatus) {
    case messaging.AuthorizationStatus.AUTHORIZED:
    case messaging.AuthorizationStatus.PROVISIONAL:
      return NotificationPermission.ENABLED
    case messaging.AuthorizationStatus.DENIED:
      return NotificationPermission.DENIED
    default:
      return NotificationPermission.UNKNOWN
  }
}

export function useHasNotificationPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async function checkPermission() {
      try {
        const res = await messaging().hasPermission()
        console.log('Inside useEffect, isEnabled = ', isEnabled(res))
        setHasPermission(isEnabled(res))
        console.log('Setting hasPermission to ', hasPermission)
        setLoading(false)
      } catch (err: any) {
        setError(err)
      }
    })()
  }, [])

  return {
    loading,
    error,
    hasPermission
  }
}

export function useRequestNotificationPermission() {
  const requestNotificationPermission = useAsyncCallback(async () => {
    const authStatus = await messaging().requestPermission()
    return isEnabled(authStatus)
  })

  return requestNotificationPermission
}
