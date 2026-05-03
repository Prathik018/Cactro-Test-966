import { useEffect, useState } from 'react'
import StoryList from './components/StoryList'
import StoryViewer from './components/StoryViewer'

function App() {
  const [storyGroups, setStoryGroups] = useState([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [activeStory, setActiveStory] = useState({ userIndex: 0, storyIndex: 0 })

  useEffect(() => {
    let isMounted = true

    async function loadStories() {
      try {
        const response = await fetch(new URL('./data/stories.json', import.meta.url))
        const data = await response.json()

        if (isMounted) {
          setStoryGroups(data)
        }
      } catch (error) {
        console.error('Failed to load stories:', error)
      } finally {
        if (isMounted) {
          setIsLoadingStories(false)
        }
      }
    }

    loadStories()

    return () => {
      isMounted = false
    }
  }, [])

  const openViewer = (userIndex) => {
    setActiveStory({ userIndex, storyIndex: 0 })
    setIsViewerOpen(true)
  }

  const closeViewer = () => {
    setIsViewerOpen(false)
  }

  const goToNextStory = () => {
    setActiveStory((prev) => {
      const currentUser = storyGroups[prev.userIndex]
      const userStories = currentUser?.stories || []
      const isLastStoryInUser = prev.storyIndex >= userStories.length - 1

      if (!isLastStoryInUser) {
        return { ...prev, storyIndex: prev.storyIndex + 1 }
      }

      const isLastUser = prev.userIndex >= storyGroups.length - 1
      if (isLastUser) {
        closeViewer()
        return prev
      }

      return { userIndex: prev.userIndex + 1, storyIndex: 0 }
    })
  }

  const goToPreviousStory = () => {
    setActiveStory((prev) => {
      if (prev.storyIndex > 0) {
        return { ...prev, storyIndex: prev.storyIndex - 1 }
      }

      if (prev.userIndex === 0) {
        return prev
      }

      const previousUser = storyGroups[prev.userIndex - 1]
      const previousUserStoryCount = previousUser?.stories?.length || 1

      return {
        userIndex: prev.userIndex - 1,
        storyIndex: Math.max(previousUserStoryCount - 1, 0),
      }
    })
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto w-full max-w-md px-4 pb-8 pt-6">
        <h1 className="mb-4 text-lg font-semibold tracking-tight">Stories</h1>

        {isLoadingStories ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex w-20 shrink-0 flex-col items-center gap-2">
                <div className="h-16 w-16 animate-pulse rounded-full bg-neutral-800" />
                <div className="h-3 w-14 animate-pulse rounded bg-neutral-800" />
              </div>
            ))}
          </div>
        ) : (
          <StoryList storyGroups={storyGroups} onStoryClick={openViewer} />
        )}
      </section>

      <StoryViewer
        storyGroups={storyGroups}
        currentUserIndex={activeStory.userIndex}
        currentStoryIndex={activeStory.storyIndex}
        isViewerOpen={isViewerOpen}
        onClose={closeViewer}
        onNext={goToNextStory}
        onPrevious={goToPreviousStory}
      />
    </main>
  )
}

export default App