export type Market = 'Charlotte' | 'Raleigh';
export type FiscalWeek = 'Fiscal Week 39' | 'Fiscal Week 38' | 'Fiscal Week 37';
export type NphMeasure = 'Stop NPH' | 'Total NPH';
export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';
export type DataQualityStatus = 'Clean Data' | 'Review Imputed/Adjusted' | 'Data Validation Required';

export interface DriverRecord {
  id: string;
  name: string;
  market: Market;
  primaryCategory: string;
  opportunityCost: number;
  opportunityHours: number;
  distinctSessions: number;
  stops: number;
  confidence: ConfidenceLevel;
  dataQuality: DataQualityStatus;
  route: string;
  customerOrLocation: string;
  sessionDate: string;
  summary: string;
  action: string;
}

export interface RouteEvidenceRecord {
  id: string;
  driver: string;
  routeId: string;
  routeSessionId: string;
  sessionDate: string;
  customerOrStop: string;
  recordType: string;
  category: string;
  actualValue: number;
  baseline: number;
  variance: number;
  opportunityMinutes: number;
  opportunityCost: number;
  dataQualityStatus: DataQualityStatus;
  validationFlag: 'Confirmed' | 'Review' | 'Validation Required';
  confidence: ConfidenceLevel;
}

export interface ExportConfiguration {
  market: Market;
  reportingPeriod: FiscalWeek;
  outputFormat: 'PowerPoint' | 'Word';
  includedSections: string[];
}

export interface ExportService {
  generateExport: (config: ExportConfiguration) => Promise<{ success: boolean; fileName?: string; message: string }>;
}
