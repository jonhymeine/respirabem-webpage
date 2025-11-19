import {
  AlertType,
  type AlertTypeType,
  AQI_LEVELS,
  ASTHMA_THRESHOLDS,
  CONDITION_MESSAGES,
  RISK_COLORS,
  RISK_ICONS,
  RiskLevel,
  type RiskLevelType,
} from './constants'

export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  aqi: number
  dust: number
  precipitation: number
}

export interface Alert {
  type: AlertTypeType
  icon: string
  message: string
}

export interface Recommendation {
  icon: string
  message: string
}

export interface AsthmaRiskAssessment {
  riskLevel: RiskLevelType
  color: string
  icon: string
  message: string
  score: number
  alerts: Alert[]
  recommendations: Recommendation[]
}

/**
 * Get AQI level information based on the AQI value
 */
export function getAQILevel(aqi: number) {
  if (aqi <= AQI_LEVELS.GOOD.max) return AQI_LEVELS.GOOD
  if (aqi <= AQI_LEVELS.MODERATE.max) return AQI_LEVELS.MODERATE
  if (aqi <= AQI_LEVELS.UNHEALTHY_SENSITIVE.max) return AQI_LEVELS.UNHEALTHY_SENSITIVE
  if (aqi <= AQI_LEVELS.UNHEALTHY.max) return AQI_LEVELS.UNHEALTHY
  if (aqi <= AQI_LEVELS.VERY_UNHEALTHY.max) return AQI_LEVELS.VERY_UNHEALTHY
  return AQI_LEVELS.HAZARDOUS
}

/**
 * Calculate a composite risk score for asthmatics (0-100)
 * Lower is better
 */
export function calculateRiskScore(data: WeatherData): number {
  let score = 0

  // AQI Score (0-40 points)
  if (data.aqi <= ASTHMA_THRESHOLDS.AQI_SAFE) {
    score += 0
  } else if (data.aqi <= ASTHMA_THRESHOLDS.AQI_MODERATE) {
    score += ((data.aqi - ASTHMA_THRESHOLDS.AQI_SAFE) / 50) * 15
  } else if (data.aqi <= ASTHMA_THRESHOLDS.AQI_UNHEALTHY) {
    score += 15 + ((data.aqi - ASTHMA_THRESHOLDS.AQI_MODERATE) / 50) * 25
  } else {
    score += 40
  }

  // Humidity Score (0-25 points)
  if (data.humidity < ASTHMA_THRESHOLDS.HUMIDITY_LOW) {
    score += 15 // Very dry
  } else if (data.humidity >= ASTHMA_THRESHOLDS.HUMIDITY_OPTIMAL_MIN && data.humidity <= ASTHMA_THRESHOLDS.HUMIDITY_OPTIMAL_MAX) {
    score += 0 // Optimal
  } else if (data.humidity <= ASTHMA_THRESHOLDS.HUMIDITY_HIGH) {
    score += 10 // Slightly high
  } else {
    score += 25 // Very high
  }

  // Temperature Score (0-20 points)
  if (data.temperature < ASTHMA_THRESHOLDS.TEMP_COLD) {
    score += 20 // Very cold
  } else if (data.temperature < ASTHMA_THRESHOLDS.TEMP_COOL) {
    score += 10 // Cold
  } else if (data.temperature >= ASTHMA_THRESHOLDS.TEMP_OPTIMAL_MIN && data.temperature <= ASTHMA_THRESHOLDS.TEMP_OPTIMAL_MAX) {
    score += 0 // Optimal
  } else if (data.temperature <= ASTHMA_THRESHOLDS.TEMP_WARM) {
    score += 5 // Warm
  } else if (data.temperature <= ASTHMA_THRESHOLDS.TEMP_HOT) {
    score += 10 // Hot
  } else {
    score += 20 // Very hot
  }

  // Dust Score (0-15 points)
  if (data.dust <= ASTHMA_THRESHOLDS.DUST_LOW) {
    score += 0
  } else if (data.dust <= ASTHMA_THRESHOLDS.DUST_MODERATE) {
    score += 5
  } else if (data.dust <= ASTHMA_THRESHOLDS.DUST_HIGH) {
    score += 10
  } else {
    score += 15
  }

  return Math.min(100, Math.round(score))
}

/**
 * Generate alerts based on current conditions
 */
export function generateAlerts(data: WeatherData): Alert[] {
  const alerts: Alert[] = []

  // AQI Alerts
  if (data.aqi > ASTHMA_THRESHOLDS.AQI_UNHEALTHY) {
    alerts.push({
      type: AlertType.DANGER,
      icon: '🚨',
      message: 'Qualidade do ar INSALUBRE - Evite sair de casa',
    })
  } else if (data.aqi > ASTHMA_THRESHOLDS.AQI_MODERATE) {
    alerts.push({
      type: AlertType.WARNING,
      icon: '⚠️',
      message: 'Qualidade do ar prejudicial para grupos sensíveis',
    })
  }

  // Humidity Alerts
  if (data.humidity > ASTHMA_THRESHOLDS.HUMIDITY_HIGH) {
    alerts.push({
      type: AlertType.WARNING,
      icon: '💧',
      message: 'Umidade elevada detectada - Risco de ácaros e mofo',
    })
  } else if (data.humidity < ASTHMA_THRESHOLDS.HUMIDITY_LOW) {
    alerts.push({
      type: AlertType.WARNING,
      icon: '🏜️',
      message: 'Ar muito seco - Pode irritar vias respiratórias',
    })
  }

  // Temperature Alerts
  if (data.temperature < ASTHMA_THRESHOLDS.TEMP_COLD) {
    alerts.push({
      type: AlertType.WARNING,
      icon: '🥶',
      message: 'Temperatura muito baixa - Ar frio pode desencadear crises',
    })
  } else if (data.temperature > ASTHMA_THRESHOLDS.TEMP_HOT) {
    alerts.push({
      type: AlertType.WARNING,
      icon: '🥵',
      message: 'Temperatura muito alta - Hidrate-se bem',
    })
  }

  // Dust Alerts
  if (data.dust > ASTHMA_THRESHOLDS.DUST_HIGH) {
    alerts.push({
      type: AlertType.DANGER,
      icon: '🏭',
      message: 'Níveis críticos de poeira no ar',
    })
  } else if (data.dust > ASTHMA_THRESHOLDS.DUST_MODERATE) {
    alerts.push({
      type: AlertType.WARNING,
      icon: '🌫️',
      message: 'Poeira acima do normal - Use máscara se sair',
    })
  }

  // Wind Alerts
  if (data.windSpeed > ASTHMA_THRESHOLDS.WIND_STRONG) {
    alerts.push({
      type: AlertType.INFO,
      icon: '💨',
      message: 'Ventos fortes - Podem espalhar alérgenos',
    })
  }

  // Good conditions
  if (alerts.length === 0) {
    alerts.push({
      type: AlertType.INFO,
      icon: '✅',
      message: 'Nenhum alerta no momento - Condições favoráveis',
    })
  }

  return alerts
}

/**
 * Generate personalized recommendations
 */
export function generateRecommendations(data: WeatherData, riskScore: number): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Always carry inhaler
  recommendations.push({
    icon: '💊',
    message: 'Mantenha sempre seu inalador de emergência à mão',
  })

  if (riskScore < 25) {
    recommendations.push({
      icon: '🏃',
      message: 'Ótimo momento para atividades físicas ao ar livre',
    })
    recommendations.push({
      icon: '🌳',
      message: 'Aproveite para caminhar em parques e áreas verdes',
    })
  } else if (riskScore < 50) {
    recommendations.push({
      icon: '🚶',
      message: 'Atividades leves ao ar livre são seguras',
    })
    recommendations.push({
      icon: '⏰',
      message: 'Faça pausas frequentes durante exercícios',
    })
  } else if (riskScore < 75) {
    recommendations.push({
      icon: '🏠',
      message: 'Prefira atividades em ambientes internos',
    })
    recommendations.push({
      icon: '😷',
      message: 'Use máscara apropriada se precisar sair',
    })
    recommendations.push({
      icon: '🪟',
      message: 'Mantenha portas e janelas fechadas',
    })
  } else {
    recommendations.push({
      icon: '🚫',
      message: 'Evite sair de casa - Condições de alto risco',
    })
    recommendations.push({
      icon: '📞',
      message: 'Tenha contato médico disponível',
    })
    recommendations.push({
      icon: '❄️',
      message: 'Use ar condicionado com filtro, se disponível',
    })
  }

  // Specific recommendations based on conditions
  if (data.humidity > ASTHMA_THRESHOLDS.HUMIDITY_HIGH) {
    recommendations.push({
      icon: '🌬️',
      message: 'Use desumidificador em ambientes fechados',
    })
  }

  if (data.temperature < ASTHMA_THRESHOLDS.TEMP_COOL) {
    recommendations.push({
      icon: '🧣',
      message: 'Cubra nariz e boca ao sair no frio',
    })
  }

  if (data.dust > ASTHMA_THRESHOLDS.DUST_MODERATE) {
    recommendations.push({
      icon: '🧹',
      message: 'Evite limpar a casa hoje - poeira em suspensão',
    })
  }

  return recommendations
}

/**
 * Assess overall asthma risk based on weather conditions
 */
export function assessAsthmaRisk(data: WeatherData): AsthmaRiskAssessment {
  const score = calculateRiskScore(data)
  const alerts = generateAlerts(data)
  const recommendations = generateRecommendations(data, score)

  let riskLevel: RiskLevelType
  let message: string

  if (score < 25) {
    riskLevel = RiskLevel.LOW
    message = CONDITION_MESSAGES.EXCELLENT
  } else if (score < 50) {
    riskLevel = RiskLevel.MODERATE
    message = CONDITION_MESSAGES.GOOD
  } else if (score < 75) {
    riskLevel = RiskLevel.HIGH
    message = CONDITION_MESSAGES.FAIR
  } else {
    riskLevel = RiskLevel.VERY_HIGH
    message = CONDITION_MESSAGES.POOR
  }

  return {
    riskLevel,
    color: RISK_COLORS[riskLevel],
    icon: RISK_ICONS[riskLevel],
    message,
    score,
    alerts,
    recommendations,
  }
}

/**
 * Format wind direction from degrees to cardinal direction
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']
  const index = Math.round((degrees % 360) / 45) % 8
  return directions[index]
}

/**
 * Format temperature for display
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`
}

/**
 * Format wind speed for display
 */
export function formatWindSpeed(speed: number, direction: number): string {
  return `${Math.round(speed)} km/h ${getWindDirection(direction)}`
}

/**
 * Format humidity for display
 */
export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`
}

/**
 * Format dust level for display
 */
export function formatDust(dust: number): string {
  if (dust < ASTHMA_THRESHOLDS.DUST_LOW) return 'Baixo'
  if (dust < ASTHMA_THRESHOLDS.DUST_MODERATE) return 'Moderado'
  if (dust < ASTHMA_THRESHOLDS.DUST_HIGH) return 'Alto'
  return 'Muito Alto'
}
