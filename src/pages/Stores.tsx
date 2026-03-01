import { useGetMyStore } from '@/features/stores/hooks/useStore'
import type { Store } from '@/types';
import { useState } from 'react'

 

// ── Helpers ───────────────────────────────────────────────────────────────────
const langLabel: Record<string, string> = {
  ar: 'العربية',
  fr: 'Français',
  en: 'English',
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.05] last:border-0">
    <span className="text-white/35 text-xs shrink-0">{label}</span>
    <span className="text-white/80 text-xs text-right font-medium">{value}</span>
  </div>
)

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#13151f] border border-white/[0.07] rounded-2xl overflow-hidden animate-pulse">
    <div className="h-28 bg-white/[0.04]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-white/[0.06] rounded-lg w-2/3" />
      <div className="h-3 bg-white/[0.04] rounded-lg w-1/2" />
      <div className="h-3 bg-white/[0.04] rounded-lg w-3/4" />
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-white/[0.06] rounded-lg flex-1" />
        <div className="h-8 bg-white/[0.06] rounded-lg flex-1" />
      </div>
    </div>
  </div>
)

// ── Preview Modal ─────────────────────────────────────────────────────────────
const PreviewModal = ({ store, onClose }: { store: Store; onClose: () => void }) => {
  const storeUrl = `https://${store.domain}.next-commerce.shop`
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#13151f] rounded-2xl border border-white/[0.08] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#13151f]"
        >
          <div className="flex items-center gap-3">
            {store.logo ? (
              <img src={store.logo} alt={store.storeName} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: store.mainColor + '33', border: `1px solid ${store.mainColor}44` }}
              >
                {store.storeName?.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-white font-semibold text-base leading-none mb-0.5">{store.storeName}</h2>
              <p className="text-white/30 text-xs">{store.domain}.next-commerce.shop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white transition-all text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Color bar */}
          <div
            className="w-full h-1 rounded-full opacity-70"
            style={{ background: `linear-gradient(to left, ${store.mainColor}00, ${store.mainColor}, ${store.mainColor}00)` }}
          />

          {/* General Info */}
          <div>
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-2">معلومات عامة</p>
            <div className="bg-[#0d0f18] rounded-xl px-4 border border-white/[0.05]">
              <InfoRow label="اسم المتجر" value={store.storeName} />
              <InfoRow label="اللغة" value={langLabel[store.language] ?? store.language} />
              <InfoRow label="اللون الرئيسي" value={
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-white/10 shrink-0"
                    style={{ backgroundColor: store.mainColor }}
                  />
                  <span className="font-mono text-xs">{store.mainColor}</span>
                </div>
              } />
              <InfoRow label="البيورو" value={
                store.enableBureau
                  ? <span className="text-emerald-400">مفعّل</span>
                  : <span className="text-white/30">معطّل</span>
              } />
              <InfoRow label="نوع بطاقة المنتج"   value={store.ProductCardType}  />
              <InfoRow label="نوع بطاقة التصنيف" value={store.CategoryCardType} />
            </div>
          </div>

          {/* Delivery */}
          {store.deliveryCompany?.name && (
            <div>
              <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-2">شركة التوصيل</p>
              <div className="bg-[#0d0f18] rounded-xl px-4 border border-white/[0.05]">
                <InfoRow label="الاسم" value={
                  <div className="flex items-center gap-2">
                    {store.deliveryCompany.img && (
                      <img src={store.deliveryCompany.img} alt={store.deliveryCompany.name} className="w-5 h-5 rounded object-cover" />
                    )}
                    {store.deliveryCompany.name}
                  </div>
                } />
                <InfoRow label="المفتاح" value={
                  <span className="font-mono text-[11px] bg-white/[0.05] px-2 py-0.5 rounded">
                    {store.deliveryCompany.key}
                  </span>
                } />
                <InfoRow label="التوكن" value={
                  <span className="font-mono text-[11px] bg-white/[0.05] px-2 py-0.5 rounded max-w-[180px] truncate block">
                    {store.deliveryCompany.token?.slice(0, 24)}…
                  </span>
                } />
              </div>
            </div>
          )}

          {/* Categories */}
          {(store.categories?.length ?? 0) > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-2">
                التصنيفات ({store.categories.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {store.categories.map(cat => (
                  <div
                    key={cat.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs
                      ${cat.show
                        ? 'bg-violet-500/[0.07] border-violet-500/20 text-violet-300'
                        : 'bg-white/[0.03] border-white/[0.06] text-white/30'
                      }`}
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[9px]">🏷</span>
                    )}
                    <span className="truncate">{cat.name}</span>
                    {!cat.show && <span className="mr-auto text-[9px] opacity-50">مخفي</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visit btn */}
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: store.mainColor ?? '#7c3aed' }}
          >
            <span>🌐</span>
            تصفح المتجر
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Store Card ────────────────────────────────────────────────────────────────
const StoreCard = ({ store, onPreview }: { store: Store; onPreview: () => void }) => {
  const storeUrl = `https://${store.domain}.next-commerce.shop`
  const catCount  = store.categories?.length ?? 0
  const showCount = store.categories?.filter(c => c.show).length ?? 0

  return (
    <div className="group bg-[#13151f] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all duration-200 flex flex-col">

      {/* Color banner */}
      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(to right, ${store.mainColor ?? '#7c3aed'}, ${store.mainColor ?? '#7c3aed'}88)` }}
      />

      <div className="p-5 flex flex-col flex-1 gap-4">

        {/* Top: logo + name */}
        <div className="flex items-center gap-3">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.storeName}
              className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0"
            />
          ) : (
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: (store.mainColor ?? '#7c3aed') + '33' }}
            >
              {store.storeName?.charAt(0)}
            </div>
          )}
          <div className="overflow-hidden">
            <h3 className="text-white font-semibold text-[15px] leading-tight truncate">{store.storeName}</h3>
            <p className="text-white/30 text-[11px] truncate mt-0.5">{store.domain}.next-commerce.shop</p>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.07] text-white/50 text-[11px]">
            🌐 {langLabel[store.language] ?? store.language}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border
            ${store.enableBureau
              ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'
              : 'bg-white/[0.04] border-white/[0.06] text-white/30'
            }`}>
            📦 البيورو {store.enableBureau ? 'مفعّل' : 'معطّل'}
          </span>
          {catCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px]">
              🏷 {showCount}/{catCount} تصنيف
            </span>
          )}
        </div>

        {/* Delivery */}
        {store.deliveryCompany?.name && (
          <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            {store.deliveryCompany.img && (
              <img src={store.deliveryCompany.img} alt={store.deliveryCompany.name} className="w-5 h-5 rounded object-cover" />
            )}
            <span className="text-white/40 text-[11px]">التوصيل:</span>
            <span className="text-white/70 text-[12px] font-medium">{store.deliveryCompany.name}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onPreview}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-all border border-white/[0.07] hover:border-white/20"
          >
            👁 معاينة
          </button>
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-medium transition-all"
            style={{ backgroundColor: (store.mainColor ?? '#7c3aed') + 'cc' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            🌐 تصفح
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
const Stores = () => {
  const { data: stores, isLoading } = useGetMyStore()
  const [preview, setPreview] = useState<Store | null>(null)

  const total = stores?.length ?? 0

  return (
    <div className="min-h-screen bg-[#0d0f18] p-4 sm:p-6 lg:p-8 font-sans" dir="rtl">

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-600" />
          <h1 className="text-2xl font-bold text-white tracking-tight">المتاجر</h1>
        </div>
        <p className="text-white/35 text-sm mr-5">عرض وإدارة جميع المتاجر المرتبطة بالمنصة</p>
      </div>

      {/* ── Summary ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'إجمالي المتاجر', value: total,  color: 'from-violet-500/20 to-indigo-500/20', accent: 'text-violet-400' },
          { label: 'بيورو مفعّل',   value: stores?.filter((s: Store) => s.enableBureau).length ?? 0,  color: 'from-emerald-500/20 to-teal-500/20', accent: 'text-emerald-400' },
          { label: 'بدون توصيل',    value: stores?.filter((s: Store) => !s.deliveryCompany?.name).length ?? 0, color: 'from-amber-500/20 to-orange-500/20', accent: 'text-amber-400' },
          { label: 'إجمالي تصنيفات', value: stores?.reduce((acc: number, s: Store) => acc + (s.categories?.length ?? 0), 0) ?? 0, color: 'from-sky-500/20 to-blue-500/20', accent: 'text-sky-400' },
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

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : total === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/20">
          <span className="text-5xl mb-4">🏪</span>
          <p className="text-lg font-medium">لا توجد متاجر حتى الآن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stores && stores.map((store: Store) => (
            <StoreCard
              key={store._id}
              store={store}
              onPreview={() => setPreview(store)}
            />
          ))}
        </div>
      )}

      {/* ── Preview Modal ── */}
      {preview && (
        <PreviewModal store={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  )
}

export default Stores