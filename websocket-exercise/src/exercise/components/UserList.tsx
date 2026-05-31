// =============================================================================
// 👥 UserList — Shows who's online
// =============================================================================
//
// LEARNING NOTE:
//   The server maintains the source of truth for who's online.
//   Every join/leave event includes the FULL user list, so we
//   don't need to track it client-side — just replace our local
//   list with whatever the server sends.
//
//   This is a "server-authoritative" pattern. The alternative
//   would be "optimistic" updates (add/remove locally before
//   server confirms). Server-authoritative is simpler and safer.
// =============================================================================

interface Props {
	users: string[];
	currentUsername: string | null;
}

export function UserList({ users, currentUsername }: Props) {
	return (
		<div className="user-list">
			<h3 className="user-list-title">Online — {users.length}</h3>
			<ul className="user-list-names">
				{users.map((name) => (
					<li
						key={name}
						className={`user-list-item ${name === currentUsername ? "user-list-item--you" : ""}`}
					>
						<span className="user-dot" />
						{name}
						{name === currentUsername && (
							<span className="user-you-tag">you</span>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
