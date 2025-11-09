import { fetchData } from './providers'
import './style.css'

// Default coordinates (Itajaí, Brazil)
const DEFAULT_LAT = -26.9078
const DEFAULT_LON = -48.6619

async function handleFetch(latitude = DEFAULT_LAT, longitude = DEFAULT_LON) {
  try {
    const data = await fetchData(latitude, longitude)
    console.log('Fetched data:', data)

    // ... Do something with the fetched data ...
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const handlePosition: PositionCallback = (position) => {
  const { latitude, longitude } = position.coords
  handleFetch(latitude, longitude).catch((err) => console.error('Error fetching', err))
}

const handlePositionError: PositionErrorCallback = (err) => {
  console.warn('Geolocation unavailable or denied, falling back to default coordinates', err)
  handleFetch().catch((e) => console.error('Error fetching weather with default coords', e))
}

if (typeof navigator !== 'undefined' && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(handlePosition, handlePositionError, {
    enableHighAccuracy: true,
    timeout: 10000,
  })
} else {
  console.warn('Navigator.geolocation not available, using default coordinates')
  handleFetch().catch((e) => console.error('Error fetching weather with default coords', e))
}
