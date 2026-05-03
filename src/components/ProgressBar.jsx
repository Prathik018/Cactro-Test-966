function ProgressBar({ index, currentIndex, progress }) {
  let width = '0%'

  if (index < currentIndex) {
    width = '100%'
  } else if (index === currentIndex) {
    width = `${Math.min(progress, 1) * 100}%`
  }

  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
      <div
        className="h-full rounded-full bg-white transition-[width] duration-100 ease-linear"
        style={{ width }}
      />
    </div>
  )
}

export default ProgressBar
