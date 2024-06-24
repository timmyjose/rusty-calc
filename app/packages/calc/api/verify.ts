import { TWILIO_BASE_URL } from '../constants'

export const sendSmsVerification = async (phoneNumber: string): Promise<boolean> => {
  try {
    const payload = JSON.stringify({
      to: phoneNumber,
      channel: 'sms'
    })

    const resp = await fetch(`${TWILIO_BASE_URL}/start-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    })

    const json = await resp.json()
    return json.success
  } catch (err: any) {
    console.error(err)
    return false
  }
}

export const checkVerification = async (phoneNumber: string, code: string): Promise<boolean> => {
  try {
    const payload = JSON.stringify({
      to: phoneNumber,
      code
    })

    const resp = await fetch(`${TWILIO_BASE_URL}/check-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    }) 

    const json = await resp.json()
    return json.success
  } catch (err: any) {
    console.error(err)
    return false
  }
}