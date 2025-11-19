import type { ICity, ICountry, IState } from 'country-state-city'
import { City, Country, State } from 'country-state-city'

export interface SelectedLocation {
  country: string
  countryCode: string
  state: string
  stateCode: string
  city: string
  latitude: number
  longitude: number
}

/**
 * Get all countries
 */
export function getAllCountries(): ICountry[] {
  return Country.getAllCountries()
}

/**
 * Get states of a country
 */
export function getStatesOfCountry(countryCode: string): IState[] {
  return State.getStatesOfCountry(countryCode)
}

/**
 * Get cities of a state
 */
export function getCitiesOfState(countryCode: string, stateCode: string): ICity[] {
  return City.getCitiesOfState(countryCode, stateCode)
}

/**
 * Search cities by name
 */
export function searchCities(cities: ICity[], searchTerm: string): ICity[] {
  const term = searchTerm.toLowerCase().trim()
  if (!term) return cities

  return cities.filter((city) => city.name.toLowerCase().includes(term))
}

/**
 * Save selected location to localStorage
 */
export function saveLocation(location: SelectedLocation): void {
  localStorage.setItem('selectedLocation', JSON.stringify(location))
}

/**
 * Get saved location from localStorage
 */
export function getSavedLocation(): SelectedLocation | null {
  const saved = localStorage.getItem('selectedLocation')
  if (!saved) return null

  try {
    return JSON.parse(saved) as SelectedLocation
  } catch {
    return null
  }
}

/**
 * Clear saved location
 */
export function clearSavedLocation(): void {
  localStorage.removeItem('selectedLocation')
}

/**
 * Get location display name
 */
export function getLocationDisplayName(location: SelectedLocation): string {
  return `${location.city}, ${location.state}`
}
