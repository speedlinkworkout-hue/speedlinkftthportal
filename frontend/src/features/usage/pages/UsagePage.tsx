import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowDown, ArrowUp, RefreshCw, Clock } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { useAccountStore } from '@/stores/account.store';
import { mockMonthlyUsages, mockTodayUsages } from '@/lib/mock/mockUsage';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomAreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0D1B2E] text-white px-4 py-3 rounded-xl text-xs shadow-lg space-y-1.5">
      <div className="font-semibold text-white/70 mb-1">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0 bg-slate-400" aria-hidden="true" />
          <span className="capitalize text-white/80">{entry.name}:</span>
          <span className="font-mono font-semibold">{entry.value.toFixed(2)} GB</span>
        </div>
      ))}
    </div>
  );
}

interface UsageRow {
  date: string;
  download: number;
  upload: number;
  total: number;
  planActive: string;
}

export function UsagePage() {
  const { activeAccountId } = useAccountStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading] = useState(false);

  const accountId = activeAccountId || 'acc-001';
  const monthlyUsage = mockMonthlyUsages[accountId] || [];
  const todayUsage = mockTodayUsages[accountId] || { downloadGb: 0, uploadGb: 0, lastUpdated: 'N/A', daysOnline: 0 };

  const usageTableData: UsageRow[] = monthlyUsage.map((d) => ({
    date: new Date(`${d.monthKey}-01`).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    }),
    download: d.downloadGb,
    upload: d.uploadGb,
    total: d.downloadGb + d.uploadGb,
    planActive: '10 Mbps Unlimited', // Or you could look this up dynamically
  })).reverse();

  const chartData = monthlyUsage.map((d) => ({
    label: d.month,
    download: d.downloadGb,
    upload: d.uploadGb,
  }));

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }

  return (
    <div className="p-5 lg:p-8 max-w-screen-xl mx-auto space-y-6">
      <PageHeader
        title="Usage"
        subtitle="Track your data consumption across your active plan."
      />

      {/* ── Hero Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Download */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 animate-fade-up animate-delay-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Today's Download
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#E6F7F1] flex items-center justify-center">
              <ArrowDown className="w-4 h-4 text-[#00A86B]" aria-hidden="true" />
            </div>
          </div>
          <div
            className="font-mono font-bold text-[#0D1B2E] text-3xl"
            aria-label={`${todayUsage.downloadGb} GB downloaded today`}
          >
            {todayUsage.downloadGb}
            <span className="text-base text-[#94A3B8] font-normal ml-1">GB</span>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 animate-fade-up animate-delay-150">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Today's Upload
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#E0F7F5] flex items-center justify-center">
              <ArrowUp className="w-4 h-4 text-[#00C2B2]" aria-hidden="true" />
            </div>
          </div>
          <div
            className="font-mono font-bold text-[#0D1B2E] text-3xl"
            aria-label={`${todayUsage.uploadGb} GB uploaded today`}
          >
            {todayUsage.uploadGb}
            <span className="text-base text-[#94A3B8] font-normal ml-1">GB</span>
          </div>
        </div>

        {/* Days Online */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 animate-fade-up animate-delay-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Days Online
            </p>
            <div className="w-8 h-8 rounded-lg bg-[#F5F7FA] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
            </div>
          </div>
          <div
            className="font-mono font-bold text-[#0D1B2E] text-3xl"
            aria-label={`${todayUsage.daysOnline} days active on current plan`}
          >
            {todayUsage.daysOnline}
            <span className="text-base text-[#94A3B8] font-normal ml-1">days active</span>
          </div>
        </div>
      </div>

      {/* Live indicator + refresh */}
      <div className="flex items-center justify-between -mt-2">
        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse-live shrink-0" aria-hidden="true" />
          Live data · Last refreshed: {todayUsage.lastUpdated}
        </div>
        <button
          onClick={handleRefresh}
          aria-label="Refresh usage data"
          className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F2B5B] transition-colors focus-visible:ring-2 focus-visible:ring-[#0F2B5B] focus-visible:outline-none rounded-lg px-2 py-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {/* ── Chart Section ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 animate-fade-up animate-delay-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-heading font-semibold text-[#0D1B2E] text-base">Usage Overview</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">Download and upload trends by month</p>
          </div>
        </div>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradDownload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A86B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUpload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C2B2" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00C2B2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Outfit' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Outfit' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}GB`}
                width={40}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="download"
                name="download"
                stroke="#00A86B"
                strokeWidth={2}
                fill="url(#gradDownload)"
                dot={false}
                activeDot={{ r: 4, fill: '#00A86B' }}
              />
              <Area
                type="monotone"
                dataKey="upload"
                name="upload"
                stroke="#00C2B2"
                strokeWidth={2}
                fill="url(#gradUpload)"
                dot={false}
                activeDot={{ r: 4, fill: '#00C2B2' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#00A86B]" aria-hidden="true" />
            <span className="text-xs text-[#64748B]">Download</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#00C2B2]" aria-hidden="true" />
            <span className="text-xs text-[#64748B]">Upload</span>
          </div>
        </div>
      </div>

      {/* ── Usage History Table ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-fade-up animate-delay-400">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="font-heading font-semibold text-[#0D1B2E] text-base">Usage History</h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">Last 12 months — newest first</p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          {isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} rows={1} />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm" aria-label="Usage history table">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {['Date', 'Download', 'Upload', 'Total', 'Plan Active'].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usageTableData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-[#0D1B2E]">{row.date}</td>
                    <td className="px-5 py-3 font-mono text-[#00A86B]">↓ {row.download.toFixed(2)} GB</td>
                    <td className="px-5 py-3 font-mono text-[#00C2B2]">↑ {row.upload.toFixed(2)} GB</td>
                    <td className="px-5 py-3 font-mono font-semibold text-[#0D1B2E]">
                      {row.total.toFixed(2)} GB
                    </td>
                    <td className="px-5 py-3 text-[#64748B] text-xs">{row.planActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-[#F9FAFB]">
          {usageTableData.map((row, i) => (
            <div key={i} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-[#0D1B2E]">{row.date}</span>
                <span className="font-mono font-semibold text-sm text-[#0D1B2E]">
                  {row.total.toFixed(2)} GB
                </span>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="font-mono text-[#00A86B]">↓ {row.download.toFixed(2)} GB</span>
                <span className="font-mono text-[#00C2B2]">↑ {row.upload.toFixed(2)} GB</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
