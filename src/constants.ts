// Air Quality Index (AQI) Categories and Colors
export const AQI_LEVELS = {
  GOOD: { min: 0, max: 50, color: "#00E400", label: "Bom", icon: "😊" },
  MODERATE: {
    min: 51,
    max: 100,
    color: "#FFFF00",
    label: "Moderado",
    icon: "😐",
  },
  UNHEALTHY_SENSITIVE: {
    min: 101,
    max: 150,
    color: "#FF7E00",
    label: "Insalubre para Grupos Sensíveis",
    icon: "😷",
  },
  UNHEALTHY: {
    min: 151,
    max: 200,
    color: "#FF0000",
    label: "Insalubre",
    icon: "😨",
  },
  VERY_UNHEALTHY: {
    min: 201,
    max: 300,
    color: "#8F3F97",
    label: "Muito Insalubre",
    icon: "🚨",
  },
  HAZARDOUS: {
    min: 301,
    max: 500,
    color: "#7E0023",
    label: "Perigoso",
    icon: "☠️",
  },
} as const;

// Risk levels for asthmatics
export const RiskLevel = {
  LOW: "BAIXO",
  MODERATE: "MODERADO",
  HIGH: "ALTO",
  VERY_HIGH: "MUITO_ALTO",
} as const;

export type RiskLevelType = (typeof RiskLevel)[keyof typeof RiskLevel];

export const RISK_COLORS = {
  [RiskLevel.LOW]: "#00E400",
  [RiskLevel.MODERATE]: "#FFFF00",
  [RiskLevel.HIGH]: "#FF7E00",
  [RiskLevel.VERY_HIGH]: "#FF0000",
} as const;

export const RISK_ICONS = {
  [RiskLevel.LOW]: "🟢",
  [RiskLevel.MODERATE]: "🟡",
  [RiskLevel.HIGH]: "🟠",
  [RiskLevel.VERY_HIGH]: "🔴",
} as const;

// Thresholds for asthmatic triggers
export const ASTHMA_THRESHOLDS = {
  // Air Quality Index
  AQI_SAFE: 50,
  AQI_MODERATE: 100,
  AQI_UNHEALTHY: 150,

  // Humidity (%)
  HUMIDITY_LOW: 30,
  HUMIDITY_OPTIMAL_MIN: 40,
  HUMIDITY_OPTIMAL_MAX: 60,
  HUMIDITY_HIGH: 70,

  // Temperature (°C)
  TEMP_COLD: 10,
  TEMP_COOL: 15,
  TEMP_OPTIMAL_MIN: 18,
  TEMP_OPTIMAL_MAX: 24,
  TEMP_WARM: 28,
  TEMP_HOT: 32,

  // Wind Speed (km/h)
  WIND_CALM: 10,
  WIND_MODERATE: 20,
  WIND_STRONG: 40,

  // Dust (μg/m³)
  DUST_LOW: 20,
  DUST_MODERATE: 50,
  DUST_HIGH: 100,
} as const;

// Messages for different conditions
export const CONDITION_MESSAGES = {
  EXCELLENT: "Excelente momento para atividades ao ar livre! 🌟",
  GOOD: "Boas condições. Aproveite com segurança! ✅",
  FAIR: "Condições razoáveis. Mantenha o inalador por perto. ⚠️",
  POOR: "Evite atividades intensas ao ar livre. 🚫",
  VERY_POOR: "Permaneça em ambientes fechados. Risco elevado! 🏠",
  HAZARDOUS: "ALERTA: Condições perigosas! Mantenha-se dentro de casa. 🚨",
} as const;

// Alert types
export const AlertType = {
  INFO: "info",
  WARNING: "warning",
  DANGER: "danger",
} as const;

export type AlertTypeType = (typeof AlertType)[keyof typeof AlertType];

// Default coordinates (Itajaí, Brazil)
export const DEFAULT_COORDINATES = {
  latitude: -26.9078,
  longitude: -48.6619,
  city: "Itajaí",
  state: "SC",
} as const;
