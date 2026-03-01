import { useGetOffer, useOfferupdate, useOfferDelete } from '@/features/Offers/hooks/useOffers'
import type { OfferPayload } from '@/types'
import  { useState } from 'react'

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; classes: string }> = {
    pending: { label: 'Pending',  classes: 'bg-amber-400/10 text-amber-400 border border-amber-400/20' },
    aproved: { label: 'Approved', classes: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
    refuse:  { label: 'Refused',  classes: 'bg-rose-400/10 text-rose-400 border border-rose-400/20' },
  }
  const { label, classes } = map[status] ?? { label: status, classes: 'bg-zinc-700 text-zinc-300' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  )
}

// ── Image Modal ───────────────────────────────────────────────────────────────
const ImageModal = ({ src, onClose }: { src: string; onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="relative max-w-lg w-full bg-[#1a1d27] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
        <span className="text-white/80 text-sm font-medium">Payment Receipt</span>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          ✕
        </button>
      </div>
      <div className="p-4 bg-[#13151f]">
        <img
          src={src}
          alt="Payment proof"
          className="w-full rounded-xl object-contain max-h-[60vh]"
          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/1a1d27/ffffff?text=No+Image' }}
        />
      </div>
    </div>
  </div>
)

// ── Approve / Refuse Confirm Modal ────────────────────────────────────────────
const ConfirmModal = ({
  type,
  offerTitle,
  onConfirm,
  onCancel,
  isPending,
}: {
  type: 'approve' | 'refuse'
  offerTitle: string
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}) => {
  const isApprove = type === 'approve'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1d27] rounded-2xl shadow-2xl border border-white/10 max-w-sm w-full p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${isApprove ? 'bg-emerald-400/10' : 'bg-rose-400/10'}`}>
          <span className="text-2xl">{isApprove ? '✓' : '✕'}</span>
        </div>
        <h3 className="text-white font-semibold text-center text-base mb-1">
          {isApprove ? 'Approve Offer' : 'Refuse Offer'}
        </h3>
        <p className="text-white/40 text-sm text-center mb-6">
          Are you sure you want to {isApprove ? 'approve' : 'refuse'}{' '}
          <span className="text-white/70 font-medium">"{offerTitle}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${isApprove ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'bg-rose-500 hover:bg-rose-400 text-white'}`}
          >
            {isPending ? '...' : isApprove ? 'Approve' : 'Refuse'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({
  offerTitle,
  onConfirm,
  onCancel,
  isPending,
}: {
  offerTitle: string
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-[#1a1d27] rounded-2xl shadow-2xl border border-white/10 max-w-sm w-full p-6">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
        <span className="text-2xl">🗑️</span>
      </div>
      <h3 className="text-white font-semibold text-center text-base mb-1">Delete Offer</h3>
      <p className="text-white/40 text-sm text-center mb-6">
        This action is <span className="text-rose-400 font-medium">irreversible</span>. Delete{' '}
        <span className="text-white/70 font-medium">"{offerTitle}"</span>?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all disabled:opacity-50"
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
)

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-white/[0.04] animate-pulse">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-white/[0.06] rounded-lg" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
)

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { data: offers, isLoading } = useGetOffer()
  const { mutate: update, isPending } = useOfferupdate()
  const { mutate: deleteOffer, isPending: isDeleting } = useOfferDelete()

  const [imageModal, setImageModal] = useState<string | null>(null)

  // State for approve/refuse confirm
  const [confirm, setConfirm] = useState<{
    id: string
    title: string
    type: 'approve' | 'refuse'
  } | null>(null)

  // State for delete confirm — مستقل عن confirm
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string
    title: string
  } | null>(null)

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'aproved' | 'refuse'>('all')
  const [search, setSearch] = useState('')

  const typedOffers = offers as OfferPayload[] | undefined

  const filtered = typedOffers?.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    const matchSearch =
      o.userName.toLowerCase().includes(search.toLowerCase()) ||
      o.offerTitle.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  }) ?? []

  const counts = {
    all:     typedOffers?.length ?? 0,
    pending: typedOffers?.filter(o => o.status === 'pending').length ?? 0,
    aproved: typedOffers?.filter(o => o.status === 'aproved').length ?? 0,
    refuse:  typedOffers?.filter(o => o.status === 'refuse').length ?? 0,
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleConfirm = () => {
    if (!confirm) return
    update(
      { id: confirm.id, data: { status: confirm.type === 'approve' ? 'aproved' : 'refuse' } },
      { onSettled: () => setConfirm(null) }
    )
  }

  // ✅ مصلح: لا يعتمد على confirm state
  const handleDelete = () => {
    if (!deleteConfirm) return
    deleteOffer(deleteConfirm.id, {
      onSettled: () => setDeleteConfirm(null),
    })
  }

  const filterTabs = [
    { key: 'all',     label: 'All',      count: counts.all },
    { key: 'pending', label: 'Pending',  count: counts.pending },
    { key: 'aproved', label: 'Approved', count: counts.aproved },
    { key: 'refuse',  label: 'Refused',  count: counts.refuse },
  ] as const

  return (
    <div className="min-h-screen bg-[#0d0f18] p-4 sm:p-6 lg:p-8 font-sans">

      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-600" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Offers Management</h1>
        </div>
        <p className="text-white/35 text-sm ml-5">Review and manage incoming payment offers</p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Offers', value: counts.all,     color: 'from-violet-500/20 to-indigo-500/20', accent: 'text-violet-400' },
          { label: 'Pending',      value: counts.pending, color: 'from-amber-500/20 to-orange-500/20',  accent: 'text-amber-400'  },
          { label: 'Approved',     value: counts.aproved, color: 'from-emerald-500/20 to-teal-500/20',  accent: 'text-emerald-400' },
          { label: 'Refused',      value: counts.refuse,  color: 'from-rose-500/20 to-pink-500/20',     accent: 'text-rose-400'   },
        ].map(card => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm`}
          >
            <p className="text-white/40 text-xs font-medium mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.accent}`}>
              {isLoading
                ? <span className="inline-block w-8 h-7 bg-white/10 rounded animate-pulse" />
                : card.value
              }
            </p>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-[#13151f] border border-white/[0.07] rounded-2xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-5 py-4 border-b border-white/[0.07]">

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1 flex-wrap">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${filterStatus === tab.key
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/70'
                  }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full
                  ${filterStatus === tab.key ? 'bg-white/10 text-white/70' : 'bg-white/[0.05] text-white/30'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or title..."
              className="w-full pl-8 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-xs placeholder-white/25 outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['User', 'Offer Title', 'Price', 'Orders', 'Date', 'Status', 'Actions', 'Delete'].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-white/20 text-sm">
                    No offers found
                  </td>
                </tr>
              ) : (
                filtered.map((offer) => (
                  <tr
                    key={offer._id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/40 to-indigo-600/40 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-white/70 text-xs font-semibold">
                            {offer.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white/85 text-sm font-medium leading-none mb-0.5">{offer.userName}</p>
                          <p className="text-white/30 text-[11px]">{offer.user.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-5 py-4">
                      <p className="text-white/75 text-sm font-medium max-w-[160px] truncate">{offer.offerTitle}</p>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="text-emerald-400 font-semibold text-sm">
                        ${offer.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Orders */}
                    <td className="px-5 py-4">
                      <span className="text-white/60 text-sm">{offer.orders}</span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <span className="text-white/40 text-xs whitespace-nowrap">
                        {new Date(offer.date).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={offer.status} />
                    </td>

                    {/* Approve / Refuse Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* View Payment Image */}
                        <button
                          onClick={() => setImageModal(offer.PaymentImage)}
                          title="View Payment"
                          className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all border border-white/[0.06] hover:border-white/20"
                        >
                          🧾
                        </button>

                        {/* {offer.status === 'pending' && ( */}
                          <>
                            <button
                              onClick={() => setConfirm({ id: offer._id, title: offer.offerTitle, type: 'approve' })}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-all border border-emerald-500/20"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setConfirm({ id: offer._id, title: offer.offerTitle, type: 'refuse' })}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-all border border-rose-500/20"
                            >
                              Refuse
                            </button>
                          </>
                        {/* )} */}

                        {offer.status !== 'pending' && (
                          <span className="text-white/20 text-xs italic">—</span>
                        )}
                      </div>
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setDeleteConfirm({ id: offer._id, title: offer.offerTitle })}
                        title="Delete offer"
                        className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition-all border border-red-500/20 hover:border-red-500/40"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/[0.06]">
            <p className="text-white/25 text-xs">
              Showing <span className="text-white/50">{filtered.length}</span> of{' '}
              <span className="text-white/50">{counts.all}</span> offers
            </p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {imageModal && (
        <ImageModal src={imageModal} onClose={() => setImageModal(null)} />
      )}

      {confirm && (
        <ConfirmModal
          type={confirm.type}
          offerTitle={confirm.title}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          isPending={isPending}
        />
      )}

      {/* ✅ Delete modal مستقل */}
      {deleteConfirm && (
        <DeleteModal
          offerTitle={deleteConfirm.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  )
}

export default Dashboard
