'use client'

import React, { useRef, useState } from 'react'

export interface NewsletterFormProps {
  title?: string
  apiUrl?: string
}

export default function NewsletterForm({
  title = '订阅通告',
  apiUrl = '/api/newsletter',
}: NewsletterFormProps) {
  const inputEl = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputEl.current) return

    setLoading(true)
    setError(false)
    setMessage('')

    try {
      const res = await fetch(apiUrl, {
        body: JSON.stringify({
          email: inputEl.current.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`)
      }

      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON. API endpoint might not be configured.')
      }

      const data = await res.json()

      if (data.error) {
        setError(true)
        setMessage('邮箱格式不正确，或您已订阅过该邮箱。')
        setLoading(false)
        return
      }

      inputEl.current.value = ''
      setError(false)
      setSubscribed(true)
    } catch (err) {
      setError(true)
      setMessage(
        '订阅服务未配置或网络错误。请确保在部署中设置了 BUTTONDOWN_API_KEY 等环境变量。'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {title && (
        <div className="pb-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </div>
      )}
      <form className="flex flex-col gap-3" onSubmit={subscribe}>
        <div>
          <label htmlFor="email-input" className="sr-only">
            Email address
          </label>
          <input
            autoComplete="email"
            className="focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            id="email-input"
            name="email"
            placeholder={subscribed ? '订阅成功 ! 🎉' : '请输入您的邮箱'}
            ref={inputEl}
            required
            type="email"
            disabled={subscribed || loading}
          />
        </div>
        <div>
          <button
            className={`w-full flex items-center justify-center ${
              subscribed || loading ? 'cursor-default opacity-80' : ''
            }`}
            type="submit"
            disabled={subscribed || loading}
          >
            {loading ? '正在订阅...' : subscribed ? '感谢订阅!' : '订阅'}
          </button>
        </div>
      </form>
      {error && <div className="pt-2.5 text-xs text-red-500 dark:text-red-400 leading-relaxed">{message}</div>}
    </div>
  )
}
