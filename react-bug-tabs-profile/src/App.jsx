import { useEffect, useState } from "react";

const profiles = {
	ada: {
		name: "Ada Lovelace",
		role: "Mathematician",
		bio: "Wrote notes on the Analytical Engine.",
	},
	grace: {
		name: "Grace Hopper",
		role: "Computer Scientist",
		bio: "Helped create COBOL and modern compilers.",
	},
	linus: {
		name: "Linus Torvalds",
		role: "Software Engineer",
		bio: "Created Linux and Git.",
	},
};

function fakeFetchProfile(profileId) {
	const delay = 1500 + Math.floor(Math.random() * 1200);

	return new Promise((resolve) => {
		window.setTimeout(() => {
			resolve({ ...profiles[profileId], loadedInMs: delay });
		}, delay);
	});
}

export default function App() {
	const [selectedProfileId, setSelectedProfileId] = useState("ada");
	const [profile, setProfile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let stale = false;
		setIsLoading(true);
		fakeFetchProfile(selectedProfileId).then((nextProfile) => {
			if (stale) return;
			setIsLoading(false);
			setProfile(nextProfile);
		});
		return () => {
			stale = true;
		}
	}, [selectedProfileId]);

	return (
		<main className="page">
			<div className="card">
				<span className="eyebrow">React bug practice</span>
				<h1>Async profile tabs</h1>
				<p className="intro">
					Click the different tabs quickly. Sometimes the final selected tab
					does not match the loaded profile.
				</p>

				<div className="tabs">
					{Object.keys(profiles).map((profileId) => (
						<button
							key={profileId}
							className={profileId === selectedProfileId ? "tab active" : "tab"}
							onClick={() => setSelectedProfileId(profileId)}
						>
							{profiles[profileId].name.split(" ")[0]}
						</button>
					))}
				</div>

				<section className="panel">
					<div className="status-row">
						<span>Selected tab: {profiles[selectedProfileId].name}</span>
						{isLoading ? <span className="pill">Loading…</span> : null}
					</div>

					{profile ? (
						<>
							<h2>{profile.name}</h2>
							<p className="role">{profile.role}</p>
							<p>{profile.bio}</p>
							<p className="meta">Loaded in {profile.loadedInMs}ms</p>
						</>
					) : (
						<p>Loading initial profile…</p>
					)}
				</section>
			</div>
		</main>
	);
}
