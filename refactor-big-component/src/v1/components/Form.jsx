
const Form = ({
	handleSubmit,
	numberOfVisits,
	setNumberOfVisits,
	userPersona,
	setUserPersona,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	isFormValid,
	isProcessing,
}) => {
	
  return (
    <form style={{ marginTop: "3vh" }} onSubmit={handleSubmit}>
      <div>
        <label>
          Visits
          <span
            style={{
              color: "gray",
              fontWeight: "lighter",
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
          Define a user persona{" "}
          <span
            style={{
              color: "gray",
              fontWeight: "lighter",
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
      <label className="form-label" style={{ textAlign: "left" }}>
        Time period{" "}
        <span
          style={{
            color: "gray",
            fontWeight: "lighter",
          }}
        >
          (available for dates before June 2023)
        </span>
      </label>

      <div id="time-input">
        <input
          type="date"
          style={{ marginRight: "20px" }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span style={{ fontSize: "15px" }}>to</span>
        <input
          type="date"
          style={{ marginLeft: "20px" }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className={`next-button ${isFormValid ? "active" : ""}`}
        disabled={!isFormValid || isProcessing}
      >
        <span>Begin</span>
        <span>→</span>
      </button>
    </form>
  );
};

export default Form