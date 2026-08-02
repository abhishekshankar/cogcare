import { useState } from 'react'
import NetworkInviteAdminTab from './NetworkInviteAdminTab'
import NetworkIntelligencePanel from './NetworkIntelligencePanel'
import NetworkOperationsAdmin from './NetworkOperationsAdmin'
import NetworkWaitlistAdminTab from './NetworkWaitlistAdminTab.jsx'

const TABS = [
  { id: 'invitations', label: 'Invitations' },
  { id: 'waitlist', label: 'Waitlist' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'operations', label: 'Operations' },
]

/**
 * @param {{ adminEmail: string }} props
 */
export default function NetworkAdminPanel({ adminEmail }) {
  const [tab, setTab] = useState('invitations')

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Cognition Network admin sections"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            aria-controls={`network-admin-panel-${item.id}`}
            id={`network-admin-tab-${item.id}`}
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] ${
              tab === item.id
                ? 'bg-forest text-white'
                : 'border border-border bg-white text-forest hover:bg-surface'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        id={`network-admin-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`network-admin-tab-${tab}`}
      >
        {tab === 'invitations' ? (
          <NetworkInviteAdminTab adminEmail={adminEmail} />
        ) : tab === 'waitlist' ? (
          <NetworkWaitlistAdminTab />
        ) : tab === 'intelligence' ? (
          <NetworkIntelligencePanel />
        ) : (
          <NetworkOperationsAdmin />
        )}
      </div>
    </div>
  )
}
