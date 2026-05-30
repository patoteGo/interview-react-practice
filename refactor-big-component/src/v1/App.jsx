import react, { useState, useEffect } from 'react'

function Form() {
	const [formLink, setFormLink] = useState('')
	const [userPersona, setUserPersona] = useState('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [numberOfVisits, setNumberOfVisits] = useState('')
	const [companyNumber, setCompanyNumber] = useState('')
	const [numberIncorrect, setNumberIncorrect] = useState(0)
	const [isFormValid, setIsFormValid] = useState(false)
	const [buttonText, setButtonText] = useState('Next')
	const [isProcessing, setIsProcessing] = useState(false)
	const [estimatedTime, setEstimatedTime] = useState('Enter number')
	const [recentActions, setRecentActions] = useState([])
	const [abortController, setAbortController] = useState(null)

	useEffect(() => {
		fetchPreviousActions()
	}, [])

	const fetchPreviousActions = async () => {
		try {
			const response = await fetch('https://api.com/actions', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			data.sort(
				(a, b) => new Date(b.actiond_date) - new Date(a.actiond_date)
			)
			setRecentActions(data)
		} catch (error) {
			console.error('Failed to fetch recent actions', error)
		}
	}

	const [showOverlay, setShowOverlay] = useState(false)

	const renderLayout = () => (
		<div>
			<div>
				<div>Analyzing...</div>
				<button onClick={handleCancelaction}>Cancel</button>
			</div>
		</div>
	)

	const formatDate = (dateStr) => {
		return dateStr.replace(/-/g, '')
	}

	const callBackendAPI = async (formData) => {
		const controller = new AbortController()
		setAbortController(controller)
		formData.startDate = formatDate(formData.startDate)
		formData.endDate = formatDate(formData.endDate)

		try {
			const response = await fetch('https://api.com/action', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
				signal: controller.signal,
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			setShowOverlay(false)
			window.open(
				'https://app.com/action/' + data.id,
				'_blank',
				'noopener,noreferrer'
			)
			window.location.reload()
		} catch (error) {
			if (error.name === 'AbortError') {
				console.log('Scraping halted')
			} else {
				console.error('Failed to call the API', error)
			}
		} finally {
			setShowOverlay(false)
			setIsProcessing(false)
		}
	}

	const handleCancelaction = () => {
		if (abortController) {
			abortController.abort() // Abort the fetch request
		}
		setShowOverlay(false)
		setIsProcessing(false)
	}

	useEffect(() => {
		if (!recentActions) {
			fetchPreviousActions()
		}

		setIsFormValid(startDate && endDate && endDate > startDate)
	}, [numberOfVisits, startDate, endDate])

	const handleSubmit = async (event) => {
		event.preventDefault()
		if (!isFormValid) return

		setShowOverlay(true)
		setIsProcessing(true)

		// Construct the form data object
		const formData = {
			userPersona,
			startDate,
			endDate,
			numberOfVisits: parseInt(numberOfVisits, 10),
		}
		// Calling the API with the form data
		await callBackendAPI(formData)
		setIsProcessing(false)
	}

	const handleSubmitCompanyNumber = (number) => {
		// this is unneeded, we've already set the value in state
		setCompanyNumber(number)
		if (number.length < 9) setNumberIncorrect(1)
		else setNumberIncorrect(0)
	}

	return !numberIncorrect ? (
		<div>
			<div>
				<img src={require('../imgs/LogoWhite.png')} alt="Logo" />
			</div>
			<div>
				<div>Tool</div>
				<form onSubmit={handleSubmit}>
					<label htmlFor="company_number">
						Enter your credentials
					</label>
					<input
						type="text"
						name="company_number"
						id="company_number"
						placeholder="Company Number"
						value={companyNumber}
						onChange={(e) => setCompanyNumber(e.target.value)}
					/>
					<button
						type="submit"
						onClick={(e) => handleSubmitCompanyNumber(companyNumber)}
					>
						<span>Login</span>
						<span>&gt;</span>
					</button>
					{numberIncorrect > 0 ? (
						<span>The number you entered is incorrect</span>
					) : (
						''
					)}
				</form>
			</div>
		</div>
	) : (
		<div>
			<div>
				<img
					src={require('../imgs/LogoWhite.png')}
					style={{ width: '200px', marginTop: '50px' }}
					alt="Logo"
				/>
			</div>
			<div>
				<div>
					<div>New action</div>
					<form style={{ marginTop: '3vh' }} onSubmit={handleSubmit}>
						<div>
							<label>
								Visits
								<span
									style={{
										color: 'gray',
										fontWeight: 'lighter',
									}}
								>
									(optional)
								</span>
							</label>
							<input
								type="number"
								value={numberOfVisits}
								onChange={(e) => setNumberOfVisits(e.target.value)}
							/>
							<label className="form-label">
								Define a user persona{' '}
								<span
									style={{
										color: 'gray',
										fontWeight: 'lighter',
									}}
								>
									(optional)
								</span>
							</label>
							<input
								type="text"
								id="posts-input"
								value={userPersona}
								onChange={(e) => setUserPersona(e.target.value)}
							/>
						</div>
						<label
							className="form-label"
							style={{ textAlign: 'left' }}
						>
							Time period{' '}
							<span
								style={{
									color: 'gray',
									fontWeight: 'lighter',
								}}
							>
								(available for dates before June 2023)
							</span>
						</label>

						<div id="time-input">
							<input
								type="date"
								style={{ marginRight: '20px' }}
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
							<span style={{ fontSize: '15px' }}>to</span>
							<input
								type="date"
								style={{ marginLeft: '20px' }}
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							className={`next-button ${isFormValid ? 'active' : ''}`}
							disabled={!isFormValid || isProcessing}
						>
							<span>Begin</span>
							<span>→</span>
						</button>
					</form>
				</div>
				<div id="divider"></div>

				<div>
					<div>Recents</div>
					<div>
						<div>
							{recentActions.map((action, index) => (
								<div key={index}>
									<a href={action.link} target="_blank">
										<span>r/{action.obfuscated}</span>{' '}
										<span>{action.actiond_date} (UTC)</span>
									</a>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{showOverlay ? renderLayout() : null}
		</div>
	)
}

export default Form