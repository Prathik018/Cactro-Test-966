function StoryItem({ user, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex w-20 shrink-0 flex-col items-center gap-2 text-center"
			aria-label={`Open ${user.username}'s story`}
		>
			<div className="rounded-full bg-linear-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-0.5">
				<div className="rounded-full bg-neutral-950 p-0.5">
					<img
						src={user.profileImage || user.stories?.[0]?.image}
						alt={`${user.username} profile`}
						className="h-16 w-16 rounded-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>
			<span className="w-full truncate text-xs text-neutral-200">{user.username}</span>
		</button>
	)
}

export default StoryItem
