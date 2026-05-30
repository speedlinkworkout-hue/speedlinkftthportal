export interface DailyUsage {
  date: string;       // 'Mon', 'Tue', etc.
  fullDate: string;   // ISO date string
  downloadGb: number;
  uploadGb: number;
}

export interface HourlyUsage {
  hour: string;       // '00:00', '01:00', etc.
  downloadGb: number;
  uploadGb: number;
}


export const mockDailyUsage: DailyUsage[] = [
  { date: 'Mon', fullDate: '2026-05-19', downloadGb: 4.2,  uploadGb: 0.9 },
  { date: 'Tue', fullDate: '2026-05-20', downloadGb: 6.8,  uploadGb: 1.4 },
  { date: 'Wed', fullDate: '2026-05-21', downloadGb: 3.1,  uploadGb: 0.6 },
  { date: 'Thu', fullDate: '2026-05-22', downloadGb: 8.5,  uploadGb: 2.1 },
  { date: 'Fri', fullDate: '2026-05-23', downloadGb: 11.2, uploadGb: 2.8 },
  { date: 'Sat', fullDate: '2026-05-24', downloadGb: 15.6, uploadGb: 3.5 },
  { date: 'Sun', fullDate: '2026-05-25', downloadGb: 9.4,  uploadGb: 2.0 },
];


export const mockHourlyUsage: HourlyUsage[] = [
  { hour: '00:00', downloadGb: 0.1, uploadGb: 0.02 },
  { hour: '02:00', downloadGb: 0.05, uploadGb: 0.01 },
  { hour: '04:00', downloadGb: 0.02, uploadGb: 0.005 },
  { hour: '06:00', downloadGb: 0.3,  uploadGb: 0.08 },
  { hour: '08:00', downloadGb: 1.2,  uploadGb: 0.35 },
  { hour: '10:00', downloadGb: 2.1,  uploadGb: 0.55 },
  { hour: '12:00', downloadGb: 1.8,  uploadGb: 0.42 },
  { hour: '14:00', downloadGb: 2.4,  uploadGb: 0.61 },
  { hour: '16:00', downloadGb: 1.9,  uploadGb: 0.48 },
  { hour: '18:00', downloadGb: 3.2,  uploadGb: 0.78 },
  { hour: '20:00', downloadGb: 4.5,  uploadGb: 1.1 },
  { hour: '22:00', downloadGb: 2.8,  uploadGb: 0.65 },
];

export const mockTodayUsage = {
  downloadGb: 2.34,
  uploadGb: 0.61,
  lastUpdated: '14:32:06',
  daysOnline: 4,
};
