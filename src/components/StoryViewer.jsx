import { useCallback, useEffect, useRef, useState } from 'react'
import ProgressBar from './ProgressBar'
import useStoryTimer from '../hooks/useStoryTimer'

const LONG_PRESS_MS = 220

function StoryViewer({
	storyGroups,
	currentUserIndex,
	currentStoryIndex,
	isViewerOpen,
	onClose,
	onNext,
	onPrevious,
}) {
	const [isPaused, setIsPaused] = useState(false)
	const [isImageLoading, setIsImageLoading] = useState(true)
	const longPressTimeoutRef = useRef(null)
	const longPressTriggeredRef = useRef(false)

	const currentUser = storyGroups[currentUserIndex]
	const currentStory = currentUser?.stories?.[currentStoryIndex]

	useEffect(() => {
		if (isViewerOpen) {
			setIsPaused(false)
			setIsImageLoading(true)
		}
	}, [isViewerOpen, currentUserIndex, currentStoryIndex])

	useEffect(() => {
		if (!isViewerOpen) {
			return undefined
		}

		const originalOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = originalOverflow
		}
	}, [isViewerOpen])

	const handleComplete = useCallback(() => {
		onNext()
	}, [onNext])

	const timerProgress = useStoryTimer({
		duration: 5000,
		isRunning: isViewerOpen && !isPaused,
		resetKey: `${currentUserIndex}-${currentStoryIndex}`,
		onComplete: handleComplete,
	})

	const clearLongPressTimeout = () => {
		if (longPressTimeoutRef.current) {
			clearTimeout(longPressTimeoutRef.current)
			longPressTimeoutRef.current = null
		}
	}

	const handlePointerDown = () => {
		longPressTriggeredRef.current = false
		clearLongPressTimeout()
		longPressTimeoutRef.current = setTimeout(() => {
			longPressTriggeredRef.current = true
			setIsPaused(true)
		}, LONG_PRESS_MS)
	}

	const handlePointerUp = (event) => {
		clearLongPressTimeout()

		if (longPressTriggeredRef.current) {
			longPressTriggeredRef.current = false
			setIsPaused(false)
			return
		}

		const tapX = event.clientX
		const screenMidpoint = window.innerWidth / 2

		if (tapX < screenMidpoint) {
			onPrevious()
			return
		}

		onNext()
	}

	const handlePointerLeave = () => {
		clearLongPressTimeout()
		if (longPressTriggeredRef.current) {
			longPressTriggeredRef.current = false
			setIsPaused(false)
		}
	}

	if (!isViewerOpen || !currentUser || !currentStory) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 bg-black md:flex md:items-center md:justify-center">
			<div className="relative h-screen w-full max-w-md overflow-hidden bg-black">
				{isImageLoading && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900">
						<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white" />
					</div>
				)}

				<img
					key={`${currentUser.id}-${currentStory.id}`}
					src={currentStory.image}
					alt={`${currentUser.username} story`}
					onLoad={() => setIsImageLoading(false)}
					onError={() => setIsImageLoading(false)}
					className="h-full w-full object-cover"
				/>

				<div className="absolute inset-x-0 top-0 z-40 bg-linear-to-b from-black/65 to-transparent px-3 pt-3">
					<div className="mb-3 flex gap-1.5">
						{currentUser.stories.map((story, index) => (
							<ProgressBar
								key={story.id}
								index={index}
								currentIndex={currentStoryIndex}
								progress={timerProgress}
							/>
						))}
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<img
								src={currentUser.profileImage || currentStory.image}
								alt={`${currentUser.username} profile`}
								className="h-8 w-8 rounded-full border border-white/40 object-cover"
							/>
							<span className="text-sm font-medium text-white">@{currentUser.username}</span>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="rounded-full bg-black/40 px-3 py-1 text-sm text-white"
							aria-label="Close story viewer"
						>
							Close
						</button>
					</div>
				</div>

				<div className="absolute inset-0 z-30 flex" onContextMenu={(e) => e.preventDefault()}>
					<button
						type="button"
						className="h-full w-1/2 bg-transparent"
						aria-label="Previous story"
						onPointerDown={handlePointerDown}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerLeave}
						onPointerLeave={handlePointerLeave}
					/>
					<button
						type="button"
						className="h-full w-1/2 bg-transparent"
						aria-label="Next story"
						onPointerDown={handlePointerDown}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerLeave}
						onPointerLeave={handlePointerLeave}
					/>
				</div>
			</div>
		</div>
	)
}

export default StoryViewer
