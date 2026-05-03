import { useEffect, useRef, useState } from 'react'

function useStoryTimer({ duration = 5000, isRunning, resetKey, onComplete }) {
	const [progress, setProgress] = useState(0)
	const frameRef = useRef(null)
	const startedAtRef = useRef(0)
	const elapsedRef = useRef(0)

	useEffect(() => {
		setProgress(0)
		elapsedRef.current = 0
		startedAtRef.current = performance.now()
	}, [resetKey])

	useEffect(() => {
		if (!isRunning) {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current)
				frameRef.current = null
			}

			return
		}

		startedAtRef.current = performance.now() - elapsedRef.current

		const tick = (timestamp) => {
			elapsedRef.current = timestamp - startedAtRef.current
			const nextProgress = Math.min(elapsedRef.current / duration, 1)
			setProgress(nextProgress)

			if (nextProgress >= 1) {
				onComplete()
				return
			}

			frameRef.current = requestAnimationFrame(tick)
		}

		frameRef.current = requestAnimationFrame(tick)

		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current)
				frameRef.current = null
			}
		}
	}, [duration, isRunning, onComplete, resetKey])

	return progress
}

export default useStoryTimer
