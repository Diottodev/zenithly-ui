import { useCallback, useState } from 'react'
import { useIntegrationTokens } from './use-integration-tokens'

interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  labelIds: string[]
}

interface SendEmailData {
  to: string
  subject: string
  body: string
}

const BASE64URL_PADDING_REGEX = /=+$/g
const BASE64URL_PADDING_END_REGEX = /=+$/

export function useGmail(userId: string) {
  const { getGoogleTokens } = useIntegrationTokens(userId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getMessages = useCallback(
    async (maxResults = 50): Promise<GmailMessage[]> => {
      setIsLoading(true)
      setError(null)

      try {
        const tokenData = await getGoogleTokens()
        if (!tokenData) {
          throw new Error('Token não encontrado')
        }

        const response = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
          {
            headers: {
              Authorization: `${tokenData.tokenType} ${tokenData.accessToken}`,
              Accept: 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error('Erro ao buscar mensagens do Gmail')
        }

        const data = await response.json()
        return data.messages || []
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [getGoogleTokens]
  )

  const sendEmail = useCallback(
    async (emailData: SendEmailData): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const tokenData = await getGoogleTokens()
        if (!tokenData) {
          throw new Error('Token não encontrado')
        }

        // Criar o email no formato RFC 2822
        const email = [
          `To: ${emailData.to}`,
          `Subject: ${emailData.subject}`,
          '',
          emailData.body,
        ].join('\n')

        const encodedEmail = btoa(email)
          .replace(BASE64URL_PADDING_REGEX, '')
          .replace(/\//g, '_')
          .replace(BASE64URL_PADDING_END_REGEX, '')

        const response = await fetch(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          {
            method: 'POST',
            headers: {
              Authorization: `${tokenData.tokenType} ${tokenData.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              raw: encodedEmail,
            }),
          }
        )

        if (!response.ok) {
          throw new Error('Erro ao enviar email')
        }

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [getGoogleTokens]
  )

  return {
    getMessages,
    sendEmail,
    isLoading,
    error,
  }
}
