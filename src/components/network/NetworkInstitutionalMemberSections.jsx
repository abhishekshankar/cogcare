import { useState } from 'react'
import { callNetworkApi, getNetworkApiUrl } from '../../services/networkApiClient.js'
import { networkBodySm, networkCaption, networkInput, networkLabel, networkPanel, networkPrimaryBtn, networkSecondaryBtn, networkSectionTitle, networkStackTight } from './networkUi.js'

export default function NetworkInstitutionalMemberSections({ workspace, onRefresh, communicationsConsent }) {
  const [proposal, setProposal] = useState({ title: '', summary: '', topic: '' })
  const [topics, setTopics] = useState(() => { try { return JSON.parse(workspace?.preferences?.topicsJson || '[]').join(', ') } catch { return '' } })
  const [cadence, setCadence] = useState(workspace?.preferences?.notificationCadence || 'none')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  if (!workspace || !getNetworkApiUrl('member')) return null

  async function act(operation, payload) {
    setBusy(operation); setMessage('')
    try { await callNetworkApi('member', { operation, ...payload }); setMessage('Saved.'); await onRefresh() }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save.') }
    finally { setBusy('') }
  }

  return <section id="institution" className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8" aria-labelledby="institution-title">
    <h2 id="institution-title" className={networkSectionTitle}>Institutional participation</h2>
    <p className={`mt-2 ${networkBodySm}`}>Proposals, salons, introductions, and recognition remain optional. Nothing here changes your passive/private standing.</p>
    {message ? <p className="mt-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-forest" role="status">{message}</p> : null}
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className={`${networkPanel} p-5`}><h3 className="font-serif text-lg text-ink">Recognition approvals</h3><p className={`mt-2 ${networkCaption}`}>Your name is not authorized by membership. Decide each proposed attribution separately.</p>
        {workspace.attributions?.filter((x) => x.status === 'pending').length ? <ul className={`mt-4 ${networkStackTight}`}>{workspace.attributions.filter((x) => x.status === 'pending').map((item) => <li key={item.id} className="border-t border-border pt-4"><p className={networkBodySm}>{item.proposedText}</p><div className="mt-3 flex gap-2"><button className={networkPrimaryBtn} disabled={busy} onClick={() => act('decideAttribution', { id: item.id, decision: 'approved' })}>Approve this item</button><button className={networkSecondaryBtn} disabled={busy} onClick={() => act('decideAttribution', { id: item.id, decision: 'declined' })}>Decline this item</button></div></li>)}</ul> : <p className={`mt-4 ${networkBodySm}`}>No attribution requests await your decision.</p>}
      </div>
      <div className={`${networkPanel} p-5`}><h3 className="font-serif text-lg text-ink">Professional introductions</h3><p className={`mt-2 ${networkCaption}`}>Contact details are not released here. Both members must consent first.</p>
        {workspace.introductions?.filter((x) => x.status === 'pending').length ? <ul className={`mt-4 ${networkStackTight}`}>{workspace.introductions.filter((x) => x.status === 'pending').map((item) => <li key={item.id} className="border-t border-border pt-4"><p className={networkBodySm}>{item.purpose}</p><div className="mt-3 flex gap-2"><button className={networkPrimaryBtn} disabled={busy} onClick={() => act('decideIntroduction', { id: item.id, decision: 'accepted' })}>Consent</button><button className={networkSecondaryBtn} disabled={busy} onClick={() => act('decideIntroduction', { id: item.id, decision: 'declined' })}>Decline this introduction</button></div></li>)}</ul> : <p className={`mt-4 ${networkBodySm}`}>No introduction requests are pending.</p>}
      </div>
      <div className={`${networkPanel} p-5`}><h3 className="font-serif text-lg text-ink">Initiatives & your proposals</h3>{workspace.initiatives?.length ? <ul className="mt-4 space-y-3">{workspace.initiatives.map((x) => <li key={x.id}><strong className="text-sm text-ink">{x.title}</strong><p className={networkCaption}>{x.summary}</p></li>)}</ul> : <p className={`mt-3 ${networkBodySm}`}>No initiatives are currently open.</p>}
        <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); act('submitProposal', proposal); setProposal({ title: '', summary: '', topic: '' }) }}><label className="block"><span className={networkLabel}>Propose an idea</span><input required className={networkInput} placeholder="Proposal title" value={proposal.title} onChange={(e) => setProposal((x) => ({ ...x, title: e.target.value }))} /></label><textarea required rows={3} className={networkInput} aria-label="Proposal summary" placeholder="A concise, non-clinical summary" value={proposal.summary} onChange={(e) => setProposal((x) => ({ ...x, summary: e.target.value }))} /><button className={networkPrimaryBtn} disabled={busy}>Submit for review</button></form>
      </div>
      <div className={`${networkPanel} p-5`}><h3 className="font-serif text-lg text-ink">Salons & controlled events</h3>{workspace.events?.length ? <ul className={`mt-4 ${networkStackTight}`}>{workspace.events.map((item) => {
        const rsvp = workspace.eventResponses?.find((x) => x.eventId === item.id)
        return <li key={item.id} className="border-t border-border pt-4"><strong className="text-sm text-ink">{item.title}</strong><p className={networkCaption}>{new Date(item.startsAt).toLocaleString()} · Attendance is private.</p>
          {rsvp ? <p className={`mt-3 ${networkBodySm}`} role="status">
            {rsvp.response === 'attending' ? 'You requested a place — attendance is private.'
              : rsvp.response === 'waitlist' ? 'You are on the waitlist for this event.'
                : rsvp.response === 'withdrawn' ? 'Your RSVP was withdrawn.'
                  : 'You declined this invitation — no further action expected.'}
          </p> : <div className="mt-3 flex gap-2"><button className={networkPrimaryBtn} disabled={busy} onClick={() => act('respondEvent', { eventId: item.id, response: 'attending' })}>Request a place</button><button className={networkSecondaryBtn} disabled={busy} onClick={() => act('respondEvent', { eventId: item.id, response: 'declined' })}>Decline this invitation</button></div>}
        </li>
      })}</ul> : <p className={`mt-3 ${networkBodySm}`}>No salons or events are currently open.</p>}
      </div>
      <form className={`${networkPanel} p-5 lg:col-span-2`} onSubmit={(e) => { e.preventDefault(); act('savePreferences', { topics: topics.split(',').map((x) => x.trim()).filter(Boolean), notificationCadence: cadence }) }}><h3 className="font-serif text-lg text-ink">Topics & notifications</h3><p className={`mt-2 ${networkCaption}`}>Preferences improve relevance. Email cadence remains off unless you have separately consented to communications.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label><span className={networkLabel}>Topics (comma separated)</span><input className={networkInput} value={topics} onChange={(e) => setTopics(e.target.value)} /></label><label><span className={networkLabel}>Email cadence</span><select className={networkInput} value={cadence} onChange={(e) => setCadence(e.target.value)}><option value="none">None</option><option value="important_only" disabled={!communicationsConsent}>Important only</option><option value="monthly" disabled={!communicationsConsent}>Monthly digest</option></select></label></div><button className={`${networkPrimaryBtn} mt-4`} disabled={busy}>Save preferences</button></form>
    </div>
  </section>
}
