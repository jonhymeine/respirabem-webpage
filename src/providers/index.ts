import dayjs from 'dayjs'

function buildQueryString(obj: Record<string, unknown>) {
  const parts: string[] = []
  for (const key in obj) {
    const val = obj[key]
    if (val === undefined || val === null) continue
    let encodedValue: string
    if (Array.isArray(val)) {
      encodedValue = encodeURIComponent(val.join(','))
    } else {
      encodedValue = encodeURIComponent(String(val))
    }
    parts.push(`${encodeURIComponent(key)}=${encodedValue}`)
  }

  return parts.length > 0 ? `?${parts.join('&')}` : ''
}

interface OpenMeteoResponse<T extends Record<string, unknown>> {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  hourly: T
  hourly_units: Record<keyof T, string>
}

interface FetchDataResult {
  forecastData: OpenMeteoResponse<{
    precipitation: number[]
    relative_humidity_2m: number[]
    temperature_80m: number[]
    time: string[]
    wind_direction_80m: number[]
    wind_speed_80m: number[]
  }>
  aqiData: OpenMeteoResponse<{
    dust: number[]
    time: string[]
    us_aqi: number[]
  }>
}

export async function fetchData(latitude: number, longitude: number): Promise<FetchDataResult> {
  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

  const forecastParms = {
    latitude,
    longitude,
    hourly: ['temperature_80m', 'precipitation', 'wind_speed_80m', 'wind_direction_80m', 'relative_humidity_2m'],
    timezone: 'auto',
    start_date: today,
    end_date: tomorrow,
  }

  const aqiParms = {
    latitude,
    longitude,
    hourly: ['us_aqi', 'dust'],
    timezone: 'auto',
    start_date: today,
    end_date: tomorrow,
  }

  const forecastUrl = `https://api.open-meteo.com/v1/forecast${buildQueryString(forecastParms)}`
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality${buildQueryString(aqiParms)}`

  const [forecastResponse, aqiResponse] = await Promise.all([fetch(forecastUrl), fetch(aqiUrl)])
  const [forecastData, aqiData] = await Promise.all([forecastResponse.json(), aqiResponse.json()])

  return { forecastData, aqiData }
}
