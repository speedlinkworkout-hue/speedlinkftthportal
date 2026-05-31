export interface MonthlyUsage {
  month: string;      // 'Jan', 'Feb', etc.
  monthKey: string;   // YYYY-MM
  downloadGb: number;
  uploadGb: number;
}

export interface HourlyUsage {
  hour: string;       // '00:00', '01:00', etc.
  downloadGb: number;
  uploadGb: number;
}


export const mockMonthlyUsage: MonthlyUsage[] = [
  { month: 'Jan', monthKey: '2026-01', downloadGb: 112.4, uploadGb: 19.8 },
  { month: 'Feb', monthKey: '2026-02', downloadGb: 128.6, uploadGb: 22.1 },
  { month: 'Mar', monthKey: '2026-03', downloadGb: 121.3, uploadGb: 20.7 },
  { month: 'Apr', monthKey: '2026-04', downloadGb: 139.5, uploadGb: 24.2 },
  { month: 'May', monthKey: '2026-05', downloadGb: 146.2, uploadGb: 25.6 },
  { month: 'Jun', monthKey: '2026-06', downloadGb: 151.8, uploadGb: 27.0 },
  { month: 'Jul', monthKey: '2026-07', downloadGb: 158.1, uploadGb: 28.5 },
  { month: 'Aug', monthKey: '2026-08', downloadGb: 149.7, uploadGb: 26.4 },
  { month: 'Sep', monthKey: '2026-09', downloadGb: 141.0, uploadGb: 24.9 },
  { month: 'Oct', monthKey: '2026-10', downloadGb: 154.6, uploadGb: 27.8 },
  { month: 'Nov', monthKey: '2026-11', downloadGb: 160.2, uploadGb: 29.1 },
  { month: 'Dec', monthKey: '2026-12', downloadGb: 167.4, uploadGb: 30.3 },
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
