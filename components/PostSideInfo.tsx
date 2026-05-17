type RecordedAt = {
  location?: string
  weather?: string
}

type PostSideInfoProps = {
  recordedAt?: RecordedAt | string
}

function normalizeRecordedAt(recordedAt?: RecordedAt | string): RecordedAt | null {
  if (!recordedAt) {
    return null
  }

  if (typeof recordedAt === 'string') {
    return { location: recordedAt }
  }

  return recordedAt
}

export default function PostSideInfo({ recordedAt }: PostSideInfoProps) {
  const record = normalizeRecordedAt(recordedAt)

  if (!record || (!record.location && !record.weather)) {
    return null
  }

  return (
    <div className="mt-8 border-t border-white/25 pt-6 text-sm font-bold">
      <h2 className="text-xs font-black tracking-[0.22em] text-slate-200 uppercase">记于</h2>
      <div className="mt-3 space-y-2 text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
        {record.location && <p>{record.location}</p>}
        {record.weather && <p className="text-slate-200">{record.weather}</p>}
      </div>
    </div>
  )
}
