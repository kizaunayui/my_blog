'use client'

import { useEffect, useMemo, useState } from 'react'

type WeatherState = {
  label: string
  temperature: string
  precipitation: string
}

type IpState = {
  value: string
}

type PostSideInfoProps = {
  date: string
}

const SHANGHAI = {
  label: 'Shanghai',
  latitude: 31.2304,
  longitude: 121.4737,
  timezone: 'Asia/Shanghai',
}

const weatherCodeLabels: Record<number, string> = {
  0: 'Clear',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Fog',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  61: 'Rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Showers',
  81: 'Showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
}

function formatDateForApi(date: string) {
  return new Date(date).toISOString().slice(0, 10)
}

function formatTemperature(min?: number, max?: number) {
  if (typeof min !== 'number' || typeof max !== 'number') {
    return 'Unavailable'
  }

  return `${Math.round(min)}-${Math.round(max)} C`
}

export default function PostSideInfo({ date }: PostSideInfoProps) {
  const [weather, setWeather] = useState<WeatherState | null>(null)
  const [ip, setIp] = useState<IpState | null>(null)
  const [weatherError, setWeatherError] = useState(false)
  const [ipError, setIpError] = useState(false)

  const postDate = useMemo(() => formatDateForApi(date), [date])

  useEffect(() => {
    let cancelled = false

    async function loadWeather() {
      setWeatherError(false)

      try {
        const params = new URLSearchParams({
          latitude: String(SHANGHAI.latitude),
          longitude: String(SHANGHAI.longitude),
          start_date: postDate,
          end_date: postDate,
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
          timezone: SHANGHAI.timezone,
        })
        const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`)

        if (!response.ok) {
          throw new Error('Weather request failed')
        }

        const data = await response.json()
        const code = data?.daily?.weather_code?.[0]
        const max = data?.daily?.temperature_2m_max?.[0]
        const min = data?.daily?.temperature_2m_min?.[0]
        const precipitation = data?.daily?.precipitation_sum?.[0]

        if (!cancelled) {
          setWeather({
            label: weatherCodeLabels[code] || 'Weather',
            temperature: formatTemperature(min, max),
            precipitation:
              typeof precipitation === 'number' ? `${precipitation.toFixed(1)} mm rain` : 'Rain unknown',
          })
        }
      } catch {
        if (!cancelled) {
          setWeatherError(true)
        }
      }
    }

    loadWeather()

    return () => {
      cancelled = true
    }
  }, [postDate])

  useEffect(() => {
    let cancelled = false

    async function loadIp() {
      setIpError(false)

      try {
        const response = await fetch('https://api.ipify.org?format=json')

        if (!response.ok) {
          throw new Error('IP request failed')
        }

        const data = await response.json()

        if (!cancelled) {
          setIp({ value: data?.ip || 'Unavailable' })
        }
      } catch {
        if (!cancelled) {
          setIpError(true)
        }
      }
    }

    loadIp()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mt-8 border-t border-white/25 pt-6 text-sm font-bold">
      <h2 className="text-xs font-black tracking-[0.22em] text-slate-200 uppercase">Weather</h2>
      <div className="mt-3 space-y-1 text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
        <p>{weather ? `${SHANGHAI.label} · ${weather.label}` : weatherError ? 'Weather unavailable' : 'Loading weather...'}</p>
        {weather && <p className="text-slate-200">{weather.temperature}</p>}
        {weather && <p className="text-slate-200">{weather.precipitation}</p>}
      </div>

      <h2 className="mt-6 text-xs font-black tracking-[0.22em] text-slate-200 uppercase">IP</h2>
      <p className="mt-3 break-all text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
        {ip ? ip.value : ipError ? 'IP unavailable' : 'Loading IP...'}
      </p>
    </div>
  )
}
