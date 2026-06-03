import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuthStore } from '@/stores/auth.store';
import { useAccountStore } from '@/stores/account.store';
import { Camera, MapPin, Plus } from 'lucide-react';
import { PlanStatusBadge } from '@/components/common/PlanStatusBadge';
import { PlanStatus } from '@/types/plan.types';

type SettingsTab = 'Profile' | 'Security' | 'Notifications' | 'Linked Accounts';

export function AccountSettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('Profile');
  const { user } = useAuthStore();
  const { accounts, activeAccountId, setActiveAccount } = useAccountStore();
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'U';

  const tabs: SettingsTab[] = ['Profile', 'Security', 'Notifications', 'Linked Accounts'];

  return (
    <div className="p-5 lg:p-8 max-w-screen-xl mx-auto space-y-6">
      <PageHeader title="Account Settings" subtitle="Manage your profile, security, and linked connections." />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Sidebar Nav */}
        <div className="lg:w-[240px] shrink-0">
          <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap flex-1 lg:w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === t
                    ? 'bg-[#F5F7FA] text-[#0F2B5B] font-semibold'
                    : 'text-[#64748B] hover:text-[#0D1B2E] hover:bg-[#F5F7FA]/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 lg:p-8">
          {tab === 'Profile' && (
            <div className="space-y-8 animate-fade-up">
              <div>
                <h3 className="font-heading font-semibold text-[#0D1B2E] text-lg mb-4">Profile Information</h3>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#00A86B] text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                      {initials}
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F5F7FA] transition-all">
                      <Camera className="w-3.5 h-3.5 text-[#0F2B5B]" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D1B2E] text-lg">{user?.firstName} {user?.lastName}</p>
                    <span className="inline-block mt-1 px-2.5 py-1 rounded-md bg-[#F5F7FA] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      Residential Customer
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    defaultValue={`${user?.firstName} ${user?.lastName}`}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0D1B2E] focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0D1B2E] focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+234 800 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0D1B2E] focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button className="px-6 py-2.5 rounded-full bg-[#0F2B5B] text-white text-sm font-semibold hover:bg-[#1A3F7A] transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {tab === 'Security' && (
            <div className="space-y-8 animate-fade-up">
              <div>
                <h3 className="font-heading font-semibold text-[#0D1B2E] text-lg mb-1">Change Password</h3>
                <p className="text-sm text-[#64748B] mb-4">Ensure your account is using a long, random password to stay secure.</p>
                <div className="space-y-4 max-w-md">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:border-[#0F2B5B] focus:ring-2 focus:ring-[#0F2B5B]/10 outline-none transition-all"
                  />
                  <button className="px-6 py-2.5 rounded-full bg-[#00A86B] text-white text-sm font-semibold hover:bg-[#009960] transition-all">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-semibold text-[#0D1B2E] text-lg">Two-Factor Authentication</h3>
                    <p className="text-sm text-[#64748B]">Add an extra layer of security to your account.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E6F7F1] text-[#00A86B] text-xs font-bold uppercase tracking-wider">
                    Enabled
                  </span>
                </div>
                <button className="px-6 py-2 rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#0F2B5B] hover:bg-[#F5F7FA] transition-all">
                  Manage 2FA
                </button>
              </div>
            </div>
          )}

          {tab === 'Notifications' && (
            <div className="space-y-8 animate-fade-up">
              <div>
                <h3 className="font-heading font-semibold text-[#0D1B2E] text-lg mb-1">Notification Preferences</h3>
                <p className="text-sm text-[#64748B] mb-6">Choose what updates you want to receive and where.</p>

                <div className="space-y-6">
                  {[
                    { title: 'Plan Expiry Alerts', desc: 'Get notified before your active plan expires.' },
                    { title: 'Payment Confirmations', desc: 'Receipts and top-up confirmations.' },
                    { title: 'Ticket Updates', desc: 'Alerts when an agent replies to your ticket.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-6 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-[#0D1B2E]">{item.title}</p>
                        <p className="text-xs text-[#64748B]">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#0F2B5B] focus:ring-[#0F2B5B] border-[#E2E8F0]" />
                          Email
                        </label>
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#0F2B5B] focus:ring-[#0F2B5B] border-[#E2E8F0]" />
                          WhatsApp
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E2E8F0]">
                <h3 className="font-heading font-semibold text-[#0D1B2E] text-lg mb-1">Auto-Renewal</h3>
                <p className="text-sm text-[#64748B] mb-4">Automatically renew your plan when it expires using wallet balance.</p>
                <label className="flex items-center gap-3 p-4 rounded-xl border border-[#E2E8F0] cursor-pointer hover:bg-[#F5F7FA] transition-all">
                  <input type="checkbox" className="w-5 h-5 rounded text-[#00A86B] focus:ring-[#00A86B] border-[#E2E8F0]" />
                  <div>
                    <p className="font-medium text-[#0D1B2E]">Enable Auto-Renewal</p>
                    <p className="text-xs text-[#94A3B8]">Requires sufficient wallet balance at the time of renewal.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {tab === 'Linked Accounts' && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h3 className="font-heading font-semibold text-[#0D1B2E] text-lg mb-1">Your Connections</h3>
                <p className="text-sm text-[#64748B] mb-6">Manage multiple Speedlink connections from a single profile.</p>

                <div className="space-y-4">
                  {accounts.map((acc) => {
                    const isActive = acc.id === activeAccountId;
                    return (
                      <div key={acc.id} className={`p-5 rounded-2xl border ${isActive ? 'border-[#00A86B] bg-[#E6F7F1]/30' : 'border-[#E2E8F0]'} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-[#00A86B] text-white' : 'bg-[#F5F7FA] text-[#64748B]'}`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-semibold text-[#0D1B2E]">{acc.address}</p>
                              {isActive && <span className="px-2 py-0.5 rounded-full bg-[#00A86B] text-white text-[10px] font-bold uppercase tracking-wider">Active</span>}
                            </div>
                            <p className="font-mono text-sm text-[#64748B]">{acc.accountNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <PlanStatusBadge status={PlanStatus.ACTIVE} />
                          {!isActive && (
                            <button
                              onClick={() => setActiveAccount(acc.id)}
                              className="px-4 py-2 rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#0F2B5B] hover:bg-[#F5F7FA] transition-all"
                            >
                              Switch
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <button className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3 rounded-full border border-dashed border-[#0F2B5B]/30 text-[#0F2B5B] font-semibold hover:bg-[#F5F7FA] transition-all">
                    <Plus className="w-4 h-4" />
                    Request to add another connection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
