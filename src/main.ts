import type { ICity } from 'country-state-city'
import {
  getAllCountries,
  getCitiesOfState,
  getSavedLocation,
  getStatesOfCountry,
  type SelectedLocation,
  saveLocation,
  searchCities,
} from './citySelector'
import { DEFAULT_COORDINATES } from './constants'
import { fetchData } from './providers'
import './style.css'
import { assessAsthmaRisk, formatDust, formatHumidity, formatTemperature, formatWindSpeed, getAQILevel, type WeatherData } from './utils'

// DOM Elements
const loadingEl = document.getElementById('loading')
const errorEl = document.getElementById('error')
const mainContentEl = document.getElementById('main-content')
const errorMessageEl = document.getElementById('error-message')
const retryButtonEl = document.getElementById('retry-button')

// Hero Section Elements
const locationNameEl = document.getElementById('location-name')
const statusIconEl = document.getElementById('status-icon')
const statusTitleEl = document.getElementById('status-title')
const aqiValueEl = document.getElementById('aqi-value')
const statusMessageEl = document.getElementById('status-message')

// Weather Cards Elements
const temperatureEl = document.getElementById('temperature')
const windSpeedEl = document.getElementById('wind-speed')
const humidityEl = document.getElementById('humidity')
const dustEl = document.getElementById('dust')

// Dynamic Sections
const alertsContainerEl = document.getElementById('alerts-container')
const recommendationsContainerEl = document.getElementById('recommendations-container')
const forecastContainerEl = document.getElementById('forecast-container')

// City Selection Modal Elements
const changeLocationBtn = document.getElementById('change-location-btn')
const cityModal = document.getElementById('city-modal')
const closeModalBtn = document.getElementById('close-modal-btn')
const countrySelect = document.getElementById('country-select') as HTMLSelectElement | null
const stateSelect = document.getElementById('state-select') as HTMLSelectElement | null
const citySearch = document.getElementById('city-search') as HTMLInputElement | null
const cityListContainer = document.getElementById('city-list-container')
const useGeolocationBtn = document.getElementById('use-geolocation-btn')

// State
let currentCities: ICity[] = []


/**
 * Show error state
 */
function showError(message: string) {
  if (!loadingEl || !errorEl || !errorMessageEl) return

  loadingEl.style.display = 'none'
  mainContentEl!.style.display = 'none'
  errorEl.style.display = 'flex'
  errorMessageEl.textContent = message
}

/**
 * Show main content
 */
function showMainContent() {
  if (!loadingEl || !mainContentEl) return

  loadingEl.style.display = 'none'
  errorEl!.style.display = 'none'
  mainContentEl.style.display = 'block'
}

/**
 * Update location display
 */
function updateLocation(city: string, state: string) {
  if (locationNameEl) {
    locationNameEl.textContent = `${city}, ${state}`
  }
}

/**
 * Update hero section with risk assessment
 */
function updateHeroSection(data: WeatherData) {
  const assessment = assessAsthmaRisk(data)
  const aqiLevel = getAQILevel(data.aqi)

  // Update status icon and color
  if (statusIconEl) {
    statusIconEl.textContent = assessment.icon
    statusIconEl.style.color = assessment.color
  }

  // Update status title
  if (statusTitleEl) {
    statusTitleEl.textContent = `Risco ${assessment.riskLevel}`
    statusTitleEl.style.color = assessment.color
  }

  // Update AQI display
  if (aqiValueEl) {
    aqiValueEl.textContent = Math.round(data.aqi).toString()
    aqiValueEl.style.color = aqiLevel.color
  }

  // Update status message
  if (statusMessageEl) {
    statusMessageEl.textContent = assessment.message
  }
}

/**
 * Update weather cards
 */
function updateWeatherCards(data: WeatherData) {
  if (temperatureEl) {
    temperatureEl.textContent = formatTemperature(data.temperature)
  }

  if (windSpeedEl) {
    windSpeedEl.textContent = formatWindSpeed(data.windSpeed, data.windDirection)
  }

  if (humidityEl) {
    humidityEl.textContent = formatHumidity(data.humidity)
  }

  if (dustEl) {
    dustEl.textContent = formatDust(data.dust)
  }
}

/**
 * Render alerts
 */
function renderAlerts(data: WeatherData) {
  if (!alertsContainerEl) return

  const assessment = assessAsthmaRisk(data)
  alertsContainerEl.innerHTML = ''

  assessment.alerts.forEach((alert, index) => {
    const alertEl = document.createElement('div')
    alertEl.className = `alert ${alert.type}`
    alertEl.style.animationDelay = `${index * 0.1}s`

    alertEl.innerHTML = `
      <div class="alert-icon">${alert.icon}</div>
      <div class="alert-message">${alert.message}</div>
    `

    alertsContainerEl.appendChild(alertEl)
  })
}

/**
 * Render recommendations
 */
function renderRecommendations(data: WeatherData) {
  if (!recommendationsContainerEl) return

  const assessment = assessAsthmaRisk(data)
  recommendationsContainerEl.innerHTML = ''

  assessment.recommendations.forEach((rec, index) => {
    const recEl = document.createElement('div')
    recEl.className = 'recommendation'
    recEl.style.animationDelay = `${index * 0.1}s`

    recEl.innerHTML = `
      <div class="recommendation-icon">${rec.icon}</div>
      <div class="recommendation-message">${rec.message}</div>
    `

    recommendationsContainerEl.appendChild(recEl)
  })
}

/**
 * Render forecast for next 24 hours
 */
function renderForecast(forecastData: any, aqiData: any) {
  if (!forecastContainerEl) return

  forecastContainerEl.innerHTML = ''

  // Show next 24 hours (every 3 hours)
  const hoursToShow = 24
  const step = 3

  for (let i = 0; i < hoursToShow && i < forecastData.hourly.time.length; i += step) {
    const time = new Date(forecastData.hourly.time[i])
    const hour = time.getHours()
    const temp = forecastData.hourly.temperature_80m[i]
    const aqi = aqiData.hourly.us_aqi[i]
    const aqiLevel = getAQILevel(aqi)

    const forecastEl = document.createElement('div')
    forecastEl.className = 'forecast-item'
    forecastEl.style.animationDelay = `${(i / step) * 0.1}s`

    forecastEl.innerHTML = `
      <div class="forecast-time">${hour}:00</div>
      <div class="forecast-icon">${aqiLevel.icon}</div>
      <div class="forecast-aqi" style="color: ${aqiLevel.color}">${Math.round(aqi)}</div>
      <div class="forecast-temp">${Math.round(temp)}°C</div>
    `

    forecastContainerEl.appendChild(forecastEl)
  }
}

/**
 * Update the entire UI with fetched data
 */
function updateUI(forecastData: any, aqiData: any, city: string, state: string) {
  try {
    // Get current data (first hour)
    const currentWeatherData: WeatherData = {
      temperature: forecastData.hourly.temperature_80m[0],
      humidity: forecastData.hourly.relative_humidity_2m[0],
      windSpeed: forecastData.hourly.wind_speed_80m[0],
      windDirection: forecastData.hourly.wind_direction_80m[0],
      aqi: aqiData.hourly.us_aqi[0],
      dust: aqiData.hourly.dust[0],
      precipitation: forecastData.hourly.precipitation[0],
    }

    // Update all sections
    updateLocation(city, state)
    updateHeroSection(currentWeatherData)
    updateWeatherCards(currentWeatherData)
    renderAlerts(currentWeatherData)
    renderRecommendations(currentWeatherData)
    renderForecast(forecastData, aqiData)

    // Show main content
    showMainContent()
  } catch (error) {
    console.error('Error updating UI:', error)
    showError('Erro ao processar os dados. Por favor, tente novamente.')
  }
}

/**
 * Fetch weather data and update UI
 */
async function handleFetch(
  latitude: number = DEFAULT_COORDINATES.latitude,
  longitude: number = DEFAULT_COORDINATES.longitude,
  city: string = DEFAULT_COORDINATES.city,
  state: string = DEFAULT_COORDINATES.state,
) {
  try {
    const { forecastData, aqiData } = await fetchData(latitude, longitude)
    console.log('Fetched data:', { forecastData, aqiData })

    updateUI(forecastData, aqiData, city, state)
  } catch (error) {
    console.error('Error fetching data:', error)
    showError('Não foi possível carregar os dados meteorológicos. Verifique sua conexão.')
  }
}

/**
 * Handle successful geolocation
 */
const handlePosition: PositionCallback = (position) => {
  const { latitude, longitude } = position.coords
  // For now, we'll use Itajaí as the city name
  // In a real app, you'd use a reverse geocoding API
  handleFetch(latitude, longitude, 'Sua Localização', 'BR').catch((err) => console.error('Error fetching', err))
}

/**
 * Handle geolocation error
 */
const handlePositionError: PositionErrorCallback = (err) => {
  console.warn('Geolocation unavailable or denied, falling back to default coordinates', err)
  handleFetch().catch((e) => console.error('Error fetching weather with default coords', e))
}

/**
 * Initialize the app
 */
function initApp() {
  // Setup retry button
  if (retryButtonEl) {
    retryButtonEl.addEventListener('click', () => {
      window.location.reload()
    })
  }

  // Setup city selector
  setupCitySelector()

  // Check for saved location
  const savedLocation = getSavedLocation()
  if (savedLocation) {
    handleFetch(savedLocation.latitude, savedLocation.longitude, savedLocation.city, savedLocation.state).catch((e) =>
      console.error('Error fetching weather', e),
    )
  } else {
    // Request geolocation
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handlePosition, handlePositionError, {
        enableHighAccuracy: true,
        timeout: 10000,
      })
    } else {
      console.warn('Navigator.geolocation not available, using default coordinates')
      handleFetch().catch((e) => console.error('Error fetching weather with default coords', e))
    }
  }
}

/**
 * Setup city selector modal
 */
function setupCitySelector() {
  // Open modal
  if (changeLocationBtn && cityModal) {
    changeLocationBtn.addEventListener('click', () => {
      cityModal.style.display = 'flex'
      populateCountries()
    })
  }

  // Close modal
  if (closeModalBtn && cityModal) {
    closeModalBtn.addEventListener('click', () => {
      cityModal.style.display = 'none'
    })
  }

  // Close modal on backdrop click
  if (cityModal) {
    cityModal.addEventListener('click', (e) => {
      if (e.target === cityModal) {
        cityModal.style.display = 'none'
      }
    })
  }

  // Country selection
  if (countrySelect) {
    countrySelect.addEventListener('change', () => {
      const countryCode = countrySelect.value
      if (countryCode) {
        populateStates(countryCode)
      } else {
        resetStates()
        resetCities()
      }
    })
  }

  // State selection
  if (stateSelect) {
    stateSelect.addEventListener('change', () => {
      const countryCode = countrySelect?.value
      const stateCode = stateSelect.value
      if (countryCode && stateCode) {
        populateCities(countryCode, stateCode)
      } else {
        resetCities()
      }
    })
  }

  // City search
  if (citySearch) {
    citySearch.addEventListener('input', () => {
      const searchTerm = citySearch.value
      filterCities(searchTerm)
    })
  }

  // Use geolocation button
  if (useGeolocationBtn && cityModal) {
    useGeolocationBtn.addEventListener('click', () => {
      cityModal.style.display = 'none'
      localStorage.removeItem('selectedLocation')

      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition, handlePositionError, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      }
    })
  }
}

/**
 * Populate countries dropdown
 */
function populateCountries() {
  if (!countrySelect) return

  const countries = getAllCountries()
  countrySelect.innerHTML = '<option value="">Selecione um país...</option>'

  countries.forEach((country) => {
    const option = document.createElement('option')
    option.value = country.isoCode
    option.textContent = country.name
    countrySelect.appendChild(option)
  })

  // Pre-select Brazil if available
  const brazil = countries.find((c) => c.isoCode === 'BR')
  if (brazil) {
    countrySelect.value = 'BR'
    populateStates('BR')
  }
}

/**
 * Populate states dropdown
 */
function populateStates(countryCode: string) {
  if (!stateSelect) return

  const states = getStatesOfCountry(countryCode)
  stateSelect.innerHTML = '<option value="">Selecione um estado...</option>'

  states.forEach((state) => {
    const option = document.createElement('option')
    option.value = state.isoCode
    option.textContent = state.name
    stateSelect.appendChild(option)
  })

  stateSelect.disabled = false
  resetCities()
}

/**
 * Populate cities list
 */
function populateCities(countryCode: string, stateCode: string) {
  if (!cityListContainer || !citySearch) return

  const cities = getCitiesOfState(countryCode, stateCode)
  currentCities = cities

  citySearch.disabled = false
  citySearch.value = ''

  renderCities(cities)
}

/**
 * Render cities list
 */
function renderCities(cities: ICity[]) {
  if (!cityListContainer) return

  if (cities.length === 0) {
    cityListContainer.innerHTML = '<p class="no-cities-text">Nenhuma cidade encontrada</p>'
    return
  }

  const cityList = document.createElement('ul')
  cityList.className = 'city-list'

  cities.forEach((city) => {
    const li = document.createElement('li')
    li.className = 'city-item'

    const nameSpan = document.createElement('span')
    nameSpan.className = 'city-item-name'
    nameSpan.textContent = city.name

    const coordsSpan = document.createElement('span')
    coordsSpan.className = 'city-item-coords'
    coordsSpan.textContent = `${city.latitude}, ${city.longitude}`

    li.appendChild(nameSpan)
    li.appendChild(coordsSpan)

    li.addEventListener('click', () => {
      selectCity(city)
    })

    cityList.appendChild(li)
  })

  cityListContainer.innerHTML = ''
  cityListContainer.appendChild(cityList)
}

/**
 * Filter cities based on search term
 */
function filterCities(searchTerm: string) {
  const filteredCities = searchCities(currentCities, searchTerm)
  renderCities(filteredCities)
}

/**
 * Select a city
 */
function selectCity(city: ICity) {
  if (!countrySelect || !stateSelect || !cityModal) return

  const countryCode = countrySelect.value
  const stateCode = stateSelect.value

  const countryName = countrySelect.options[countrySelect.selectedIndex]?.text || ''
  const stateName = stateSelect.options[stateSelect.selectedIndex]?.text || ''

  const location: SelectedLocation = {
    country: countryName,
    countryCode: countryCode,
    state: stateName,
    stateCode: stateCode,
    city: city.name,
    latitude: Number.parseFloat(city.latitude || '0'),
    longitude: Number.parseFloat(city.longitude || '0'),
  }

  saveLocation(location)

  // Close modal
  cityModal.style.display = 'none'

  // Fetch new data
  handleFetch(location.latitude, location.longitude, location.city, location.state).catch((e) => console.error('Error fetching weather', e))
}

/**
 * Reset states dropdown
 */
function resetStates() {
  if (!stateSelect) return
  stateSelect.innerHTML = '<option value="">Selecione um estado...</option>'
  stateSelect.disabled = true
}

/**
 * Reset cities list
 */
function resetCities() {
  if (!cityListContainer || !citySearch) return
  cityListContainer.innerHTML = '<p class="hint-text">Selecione um país e estado primeiro</p>'
  citySearch.disabled = true
  citySearch.value = ''
  currentCities = []
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
