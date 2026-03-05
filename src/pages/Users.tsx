import { useGetMyUsers, useUserDelete, useUserupdate } from '@/features/users/hooks/useUser'
import type { User } from '@/types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface UserStore {
  logo: string
  storeName: string
  id: string
}

const isExpired = (date: Date | undefined): boolean => {
  if (!date) return false
  return new Date(date) < new Date()
}

const formatDate = (date: Date | undefined): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ar-DZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-white/[0.04] animate-pulse">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-white/[0.06] rounded-lg" style={{ width: `${55 + (i * 7) % 35}%` }} />
      </td>
    ))}
  </tr>
)

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ expired, isPaid }: { expired: boolean; isPaid: boolean }) => {
  if (expired) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-rose-400/10 text-rose-400 border border-rose-400/20">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
      منتهي
    </span>
  )
  if (isPaid) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      نشط
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-400/10 text-amber-400 border border-amber-400/20">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      غير مدفوع
    </span>
  )
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
type ModalType = 'delete' | 'end-sub'

const ConfirmModal = ({
  type,
  userName,
  onConfirm,
  onCancel,
  isPending,
}: {
  type: ModalType
  userName: string
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}) => {
  const isDelete = type === 'delete'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-[#1a1d27] rounded-2xl shadow-2xl border border-white/10 max-w-sm w-full p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl
          ${isDelete ? 'bg-rose-400/10' : 'bg-amber-400/10'}`}>
          {isDelete ? '🗑️' : '⏹️'}
        </div>
        <h3 className="text-white font-semibold text-center text-base mb-1">
          {isDelete ? 'حذف العميل' : 'إنهاء الاشتراك'}
        </h3>
        <p className="text-white/40 text-sm text-center mb-6">
          {isDelete ? (
            <>هل أنت متأكد من حذف <span className="text-white/70 font-medium">"{userName}"</span>؟ لا يمكن التراجع عن هذا الإجراء.</>
          ) : (
            <>هل تريد إنهاء اشتراك <span className="text-white/70 font-medium">"{userName}"</span> وإعادة تعيين الطلبات؟</>
          )}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50
              ${isDelete
                ? 'bg-rose-500 hover:bg-rose-400 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-white'
              }`}
          >
            {isPending ? '...' : isDelete ? 'حذف' : 'إنهاء الاشتراك'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
const Users = () => {
  const { data: users, isLoading } = useGetMyUsers()
  const { mutate: update, isPending } = useUserupdate()
  const { mutate: deleteUser, isPending: isDeleting } = useUserDelete()

  const [confirm, setConfirm] = useState<{ id: string; name: string; type: ModalType } | null>(null)

  useEffect(() => {
    if (!users) return
    users.forEach((user: User) => {
      if (isExpired(user.dateOfExpire) && user.isPaid) {
        toast.error(`⚠️ انتهى اشتراك ${user.name}`, {
          description: `تاريخ الانتهاء: ${formatDate(user.dateOfExpire)}`,
          duration: 5000,
        })
      }
    })
  }, [users])

  const handleConfirm = () => {
    if (!confirm) return
    if (confirm.type === 'delete') {
      deleteUser(confirm.id, { onSettled: () => setConfirm(null) })
    } else {
      update(
        { id: confirm.id, data: { ordersCount: 0, maxOrder: 10, isPaid: false } },
        { onSettled: () => setConfirm(null) }
      )
    }
  }

  const total   = users?.length ?? 0
  const active  = users?.filter((u: User) => !isExpired(u.dateOfExpire) && u.isPaid).length ?? 0
  const expired = users?.filter((u: User) => isExpired(u.dateOfExpire)).length ?? 0
  const unpaid  = users?.filter((u: User) => !u.isPaid && !isExpired(u.dateOfExpire)).length ?? 0

  return (
    <div className="min-h-screen bg-[#0d0f18] p-4 sm:p-6 lg:p-8 font-sans" dir="rtl">

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-600" />
          <h1 className="text-2xl font-bold text-white tracking-tight">إدارة العملاء</h1>
        </div>
        <p className="text-white/35 text-sm mr-5">متابعة حالة المشتركين وانتهاء الاشتراكات</p>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'إجمالي العملاء', value: total,   color: 'from-violet-500/20 to-indigo-500/20', accent: 'text-violet-400' },
          { label: 'نشط',            value: active,  color: 'from-emerald-500/20 to-teal-500/20',  accent: 'text-emerald-400' },
          { label: 'منتهي',          value: expired, color: 'from-rose-500/20 to-pink-500/20',     accent: 'text-rose-400'   },
          { label: 'غير مدفوع',      value: unpaid,  color: 'from-amber-500/20 to-orange-500/20', accent: 'text-amber-400'  },
        ].map(card => (
          <div key={card.label}
            className={`bg-gradient-to-br ${card.color} border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm`}>
            <p className="text-white/40 text-xs font-medium mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.accent}`}>
              {isLoading
                ? <span className="inline-block w-8 h-7 bg-white/10 rounded animate-pulse" />
                : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="bg-[#13151f] border border-white/[0.07] rounded-2xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <p className="text-white/50 text-sm">
            <span className="text-white font-semibold">{total}</span> عميل مسجل
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['العميل', 'التواصل', 'المتاجر', 'الطلبات', 'تاريخ الانضمام', 'انتهاء الاشتراك', 'الحالة', 'الإجراءات'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-right text-[11px] font-semibold text-white/30 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                : users?.length === 0
                  ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center text-white/20 text-sm">
                        لا يوجد عملاء حتى الآن
                      </td>
                    </tr>
                  )
                  : users?.map((user: User) => {
                    const exp = isExpired(user.dateOfExpire)
                    const orderPct = Math.min((user.ordersCount / user.maxOrder) * 100, 100)
                    const orderFull = user.ordersCount >= user.maxOrder

                    return (
                      <tr
                        key={user._id}
                        className={`border-b border-white/[0.04] transition-colors
                          ${exp ? 'bg-rose-500/[0.03] hover:bg-rose-500/[0.05]' : 'hover:bg-white/[0.02]'}`}
                      >
                        {/* العميل */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/40 to-indigo-600/40 border border-white/10 flex items-center justify-center shrink-0">
                              <span className="text-white/70 text-xs font-semibold">
                                {user.name?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-white/85 text-sm font-medium leading-none mb-0.5">{user.name}</p>
                              <p className="text-white/30 text-[11px]">{user._id}</p>
                            </div>
                          </div>
                        </td>

                        {/* التواصل */}
                        <td className="px-5 py-4">
                          <p className="text-white/70 text-sm">{user.email}</p>
                          <p className="text-white/30 text-xs mt-0.5">{user.phone}</p>
                        </td>

                        {/* المتاجر */}
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {user.Stores?.map((store) => (
                              <div key={store.id}
                                className="flex items-center gap-1 bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[11px] px-2 py-1 rounded-full">
                                {store.logo && (
                                  <img src={store.logo} alt={store.storeName} className="w-3.5 h-3.5 rounded-full object-cover" />
                                )}
                                <span>{store.storeName}</span>
                              </div>
                            ))}
                            {(!user.Stores || user.Stores.length === 0) && (
                              <span className="text-white/20 text-xs italic">لا توجد متاجر</span>
                            )}
                          </div>
                        </td>

                        {/* الطلبات */}
                        <td className="px-5 py-4">
                          <div className="flex items-baseline gap-1 mb-1.5">
                            <span className={`font-bold text-sm ${orderFull ? 'text-rose-400' : 'text-white/80'}`}>
                              {user.ordersCount}
                            </span>
                            <span className="text-white/25 text-xs">/ {user.maxOrder}</span>
                          </div>
                          <div className="w-24 bg-white/[0.06] rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${orderFull ? 'bg-rose-500' : 'bg-violet-500'}`}
                              style={{ width: `${orderPct}%` }}
                            />
                          </div>
                        </td>

                        {/* تاريخ الانضمام */}
                        <td className="px-5 py-4">
                          <span className="text-white/40 text-xs whitespace-nowrap">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>

                        {/* انتهاء الاشتراك */}
                        <td className="px-5 py-4">
                          <span className={`text-xs font-medium whitespace-nowrap ${exp ? 'text-rose-400' : 'text-white/40'}`}>
                            {exp && <span className="mr-1">⚠️</span>}
                            {formatDate(user.dateOfExpire)}
                          </span>
                        </td>

                        {/* الحالة */}
                        <td className="px-5 py-4">
                          <StatusBadge expired={exp} isPaid={user.isPaid} />
                        </td>

                        {/* الإجراءات */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* زر إنهاء الاشتراك — يظهر فقط عند انتهاء الصلاحية */}
                            {exp && user.isPaid && (
                              <button
                                onClick={() => setConfirm({ id: user._id, name: user.name, type: 'end-sub' })}
                                title="إنهاء الاشتراك"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium transition-all border border-amber-500/20 whitespace-nowrap"
                              >
                                ⏹️ إنهاء
                              </button>
                            )}

                            {/* زر الحذف — يظهر دائماً */}
                            <button
                            
                              title="حذف العميل"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-all border border-rose-500/20 whitespace-nowrap"
                            >
                              🗑️ حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!isLoading && total > 0 && (
          <div className="px-5 py-3 border-t border-white/[0.06]">
            <p className="text-white/25 text-xs text-right">
              إجمالي <span className="text-white/50">{total}</span> عميل
            </p>
          </div>
        )}
      </div>

      {/* ── Confirm Modal ── */}
      {confirm && (
        <ConfirmModal
          type={confirm.type}
          userName={confirm.name}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          isPending={confirm.type === 'delete' ? isDeleting : isPending}
        />
      )}
    </div>
  )
}


export default Users
