import StoryItem from './StoryItem'

function StoryList({ storyGroups, onStoryClick }) {
	return (
		<div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
			{storyGroups.map((user, index) => (
				<StoryItem key={user.id} user={user} onClick={() => onStoryClick(index)} />
			))}
		</div>
	)
}

export default StoryList
