export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
    lat?: number;
    lon?: number;
  };
  current: {
    temp_c: number;
    temp_f?: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_mph?: number;
    humidity: number;
    uv: number;
    air_quality: {
      "us-epa-index": number;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        daily_chance_of_rain?: number;
        daily_chance_of_snow?: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        chance_of_rain?: number;
        chance_of_snow?: number;
        condition: {
          text: string;
          icon: string;
        };
      }>;
      astro: {
        sunrise: string;
        sunset: string;
      };
    }>;
  };
  alerts?: {
    alert: Array<{
      headline: string;
      msgtype: string;
      severity: string;
      urgency: string;
      areas: string;
      category: string;
      certainty: string;
      event: string;
      note: string;
      effective: string;
      expires: string;
      desc: string;
      instruction: string;
    }>;
  };
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export type MobileTab = 'today' | 'forecast' | 'intel' | 'cities';

export type ChartViewMode = 'hourly' | 'daily' | 'monthly' | 'seasonal';

export interface MonthlyClimateData {
  month: string;
  fullName: string;
  avgTempC: number;
  avgHighC: number;
  avgLowC: number;
  recordHighC: number;
  recordLowC: number;
  precipMm: number;
  rainyDays: number;
}

export interface SeasonalClimateData {
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  months: string;
  avgTempC: number;
  avgHighC: number;
  avgLowC: number;
  precipMm: number;
  historicalTrend: string;
  climateNote: string;
}

export interface CityClimateProfile {
  cityName: string;
  country: string;
  zone: string;
  annualMeanTempC: number;
  annualPrecipMm: number;
  warmestMonth: string;
  coldestMonth: string;
  monthly: MonthlyClimateData[];
  seasonal: SeasonalClimateData[];
}
