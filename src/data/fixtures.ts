import { type DataQualityStatus, type DriverRecord, type RouteEvidenceRecord, type ConfidenceLevel } from '../types';

export const markets = ['Charlotte', 'Raleigh'] as const;
export const fiscalWeeks = ['Fiscal Week 39', 'Fiscal Week 38', 'Fiscal Week 37'] as const;
export const nphMeasures = ['Stop NPH', 'Total NPH'] as const;

export const driverRecords: DriverRecord[] = [
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    market: 'Charlotte',
    primaryCategory: 'Service Time',
    opportunityCost: 1284,
    opportunityHours: 30.6,
    distinctSessions: 8,
    stops: 13,
    confidence: 'High',
    dataQuality: 'Clean Data',
    route: 'CLT-1842',
    customerOrLocation: 'Oak Street Bistro',
    sessionDate: 'October 14, 2026',
    summary: 'Service opportunity recurred across 8 distinct route sessions, concentrated at three customer stops.',
    action: 'Review the recurring service pattern and observe the highest-opportunity stop before setting a measurable improvement goal.'
  },
  {
    id: 'taylor-morgan',
    name: 'Taylor Morgan',
    market: 'Charlotte',
    primaryCategory: 'Pre-Scan Time',
    opportunityCost: 1058,
    opportunityHours: 25.2,
    distinctSessions: 7,
    stops: 10,
    confidence: 'High',
    dataQuality: 'Clean Data',
    route: 'CLT-2094',
    customerOrLocation: 'Lakeview Grill',
    sessionDate: 'October 15, 2026',
    summary: 'Pre-Scan opportunity appeared across 7 distinct sessions, with the largest concentration at Lakeview Grill.',
    action: 'Review arrival-to-POD Start activity and compare conditions across the recurring route sessions.'
  },
  {
    id: 'casey-rivera',
    name: 'Casey Rivera',
    market: 'Charlotte',
    primaryCategory: 'AM Time',
    opportunityCost: 874,
    opportunityHours: 20.8,
    distinctSessions: 6,
    stops: 0,
    confidence: 'Moderate',
    dataQuality: 'Review Imputed/Adjusted',
    route: 'CLT-1776',
    customerOrLocation: 'Origin Facility',
    sessionDate: 'October 13, 2026',
    summary: 'AM opportunity occurred across 6 sessions, but adjusted timestamps affect part of the supporting evidence.',
    action: 'Validate adjusted timestamps, then review login-to-departure activity using the confirmed sessions.'
  },
  {
    id: 'avery-brooks',
    name: 'Avery Brooks',
    market: 'Charlotte',
    primaryCategory: 'Post-Scan Time',
    opportunityCost: 681,
    opportunityHours: 16.2,
    distinctSessions: 5,
    stops: 8,
    confidence: 'Moderate',
    dataQuality: 'Clean Data',
    route: 'CLT-2210',
    customerOrLocation: 'Pinecrest Kitchen',
    sessionDate: 'October 16, 2026',
    summary: 'Post-Scan opportunity recurred across 5 sessions and 8 stops, with moderate concentration on Route CLT-2210.',
    action: 'Review POD completion-to-departure activity and monitor the same measure in the next reporting period.'
  },
  {
    id: 'riley-chen',
    name: 'Riley Chen',
    market: 'Charlotte',
    primaryCategory: 'Unknown Stop',
    opportunityCost: 512,
    opportunityHours: 12.2,
    distinctSessions: 1,
    stops: 1,
    confidence: 'Low',
    dataQuality: 'Data Validation Required',
    route: 'CLT-1988',
    customerOrLocation: 'Unknown Stop 04',
    sessionDate: 'October 17, 2026',
    summary: 'One isolated extreme Unknown Stop event drives most of the opportunity and requires validation before any coaching discussion.',
    action: 'Validate the event, confirm the route-session link, and review whether the stop record is a genuine operating condition or a data issue.'
  }
];

export const weeklyTrend = [
  { week: 'FW 34', opportunity: 192, baseline: 145 },
  { week: 'FW 35', opportunity: 178, baseline: 145 },
  { week: 'FW 36', opportunity: 166, baseline: 145 },
  { week: 'FW 37', opportunity: 151, baseline: 145 },
  { week: 'FW 38', opportunity: 139, baseline: 145 },
  { week: 'FW 39', opportunity: 128, baseline: 145 }
];

export const categoryOpportunity = [
  { category: 'Service', minutes: 428 },
  { category: 'Pre-Scan', minutes: 322 },
  { category: 'AM Time', minutes: 246 },
  { category: 'Post-Scan', minutes: 174 },
  { category: 'PM Time', minutes: 108 }
];

export const routeEvidence: RouteEvidenceRecord[] = [
  {
    id: 'ev-1',
    driver: 'Jordan Lee',
    routeId: 'CLT-1842',
    routeSessionId: 'RS-1042',
    sessionDate: '2026-10-14',
    customerOrStop: 'Oak Street Bistro',
    recordType: 'Stop event',
    category: 'Service Time',
    actualValue: 38,
    baseline: 22,
    variance: 16,
    opportunityMinutes: 52,
    opportunityCost: 248,
    dataQualityStatus: 'Clean Data',
    validationFlag: 'Confirmed',
    confidence: 'High'
  },
  {
    id: 'ev-2',
    driver: 'Jordan Lee',
    routeId: 'CLT-1842',
    routeSessionId: 'RS-1940',
    sessionDate: '2026-10-15',
    customerOrStop: 'Elm Terrace',
    recordType: 'Stop event',
    category: 'Service Time',
    actualValue: 31,
    baseline: 20,
    variance: 11,
    opportunityMinutes: 42,
    opportunityCost: 185,
    dataQualityStatus: 'Clean Data',
    validationFlag: 'Confirmed',
    confidence: 'High'
  },
  {
    id: 'ev-3',
    driver: 'Taylor Morgan',
    routeId: 'CLT-2094',
    routeSessionId: 'RS-2249',
    sessionDate: '2026-10-15',
    customerOrStop: 'Lakeview Grill',
    recordType: 'Scan event',
    category: 'Pre-Scan Time',
    actualValue: 44,
    baseline: 27,
    variance: 17,
    opportunityMinutes: 48,
    opportunityCost: 196,
    dataQualityStatus: 'Clean Data',
    validationFlag: 'Confirmed',
    confidence: 'High'
  },
  {
    id: 'ev-4',
    driver: 'Taylor Morgan',
    routeId: 'CLT-2094',
    routeSessionId: 'RS-2298',
    sessionDate: '2026-10-16',
    customerOrStop: 'Cedar Market',
    recordType: 'Pre-scan event',
    category: 'Pre-Scan Time',
    actualValue: 41,
    baseline: 24,
    variance: 17,
    opportunityMinutes: 53,
    opportunityCost: 214,
    dataQualityStatus: 'Clean Data',
    validationFlag: 'Confirmed',
    confidence: 'High'
  },
  {
    id: 'ev-5',
    driver: 'Casey Rivera',
    routeId: 'CLT-1776',
    routeSessionId: 'RS-1822',
    sessionDate: '2026-10-13',
    customerOrStop: 'Origin Facility',
    recordType: 'Departure event',
    category: 'AM Time',
    actualValue: 26,
    baseline: 16,
    variance: 10,
    opportunityMinutes: 33,
    opportunityCost: 134,
    dataQualityStatus: 'Review Imputed/Adjusted',
    validationFlag: 'Review',
    confidence: 'Moderate'
  },
  {
    id: 'ev-6',
    driver: 'Avery Brooks',
    routeId: 'CLT-2210',
    routeSessionId: 'RS-2674',
    sessionDate: '2026-10-16',
    customerOrStop: 'Pinecrest Kitchen',
    recordType: 'POD event',
    category: 'Post-Scan Time',
    actualValue: 29,
    baseline: 18,
    variance: 11,
    opportunityMinutes: 40,
    opportunityCost: 136,
    dataQualityStatus: 'Clean Data',
    validationFlag: 'Confirmed',
    confidence: 'Moderate'
  },
  {
    id: 'ev-7',
    driver: 'Riley Chen',
    routeId: 'CLT-1988',
    routeSessionId: 'RS-3011',
    sessionDate: '2026-10-17',
    customerOrStop: 'Unknown Stop 04',
    recordType: 'Unknown stop',
    category: 'Unknown Stop',
    actualValue: 63,
    baseline: 17,
    variance: 46,
    opportunityMinutes: 79,
    opportunityCost: 298,
    dataQualityStatus: 'Data Validation Required',
    validationFlag: 'Validation Required',
    confidence: 'Low'
  },
  {
    id: 'ev-8',
    driver: 'Jordan Lee',
    routeId: 'CLT-1842',
    routeSessionId: 'RS-2080',
    sessionDate: '2026-10-18',
    customerOrStop: 'Northside Produce',
    recordType: 'Stop event',
    category: 'Service Time',
    actualValue: 34,
    baseline: 21,
    variance: 13,
    opportunityMinutes: 44,
    opportunityCost: 187,
    dataQualityStatus: 'Clean Data',
    validationFlag: 'Confirmed',
    confidence: 'High'
  }
];

export const driverStatusCounts = {
  clean: 3,
  review: 1,
  validation: 1
};

export const coachingPriorities = [
  {
    title: 'Service',
    guidance: 'Prioritize recurring service events at the top customer stops and validate whether stop dwell time reflects operating conditions or scan timing.'
  },
  {
    title: 'Pre-Scan',
    guidance: 'Focus on arrival-to-POD Start patterns across repeated route sessions and compare conditions at the highest-volume stop locations.'
  },
  {
    title: 'AM Time',
    guidance: 'Assess any adjusted timestamps and confirm whether login-to-departure activity remains consistent across supported sessions.'
  }
];

export const chartPalette = {
  orange: '#EE7F2D',
  green: '#2F7D4B',
  slate: '#64748B',
  amber: '#FDBA74',
  red: '#DC2626'
};

export const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
export const formatShortCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(v);
export const formatHours = (v: number) => `${v.toFixed(1)} hrs`;

export const confidenceTone: Record<ConfidenceLevel, string> = {
  High: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-red-100 text-red-700 border-red-200'
};

export const qualityTone: Record<DataQualityStatus, string> = {
  'Clean Data': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Review Imputed/Adjusted': 'bg-amber-100 text-amber-700 border-amber-200',
  'Data Validation Required': 'bg-red-100 text-red-700 border-red-200'
};

export const buildManagerAction = (confidence: ConfidenceLevel) =>
  confidence === 'Low' ? 'Data Validation Required' : 'Manager Coaching Discussion';
