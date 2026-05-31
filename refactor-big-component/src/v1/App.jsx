import react, { useState, useEffect } from "react";
import legoLogo from "../assets/LEGO_logo.png";
import Form from "./components/Form";
import LoginForm from "./components/LoginForm";
import useApi from "./hooks/useApi";

function App() {
  const [userPersona, setUserPersona] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numberOfVisits, setNumberOfVisits] = useState("");


  const formData = {
    userPersona,
    startDate,
    endDate,
    numberOfVisits: parseInt(numberOfVisits, 10),
  };

  const {
    recentActions,
    fetchPreviousActions,
    showOverlay,
    handleSubmit,
    handleCancelaction,
    isProcessing,
    handleSubmitCompanyNumber,
    companyNumber,
    setCompanyNumber,
    numberIncorrect,
  } = useApi({formData});

  useEffect(() => {
    fetchPreviousActions();
  }, []);

  const renderLayout = () => (
    <div>
      <div>
        <div>Analyzing...</div>
        <button onClick={handleCancelaction}>Cancel</button>
      </div>
    </div>
  );



  return !numberIncorrect ? (
    <div>
      <div>
        <img
          src={legoLogo}
          style={{ width: "200px", marginTop: "50px" }}
          alt="Logo"
        />
      </div>
      <div>
        <div>Tool</div>
        <LoginForm 
          setCompanyNumber={setCompanyNumber}
          handleSubmitCompanyNumber={handleSubmitCompanyNumber}
          companyNumber={companyNumber}
          numberIncorrect={numberIncorrect}
        />
      </div>
    </div>
  ) : (
    <div>
      <div>
        <img
          src={legoLogo}
          style={{ width: "200px", marginTop: "50px" }}
          alt="Logo"
        />
      </div>
      <div>
        <div>
          <div>New action</div>
          <Form 
            handleSubmit={handleSubmit}
            numberOfVisits={numberOfVisits}
            setNumberOfVisits={setNumberOfVisits}
            userPersona={userPersona}
            setUserPersona={setUserPersona}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            isFormValid={isFormValid}
            isProcessing={isProcessing}
          />
        </div>
        <div id="divider"></div>

        <div>
          <div>Recents</div>
          <div>
            <div>
              {recentActions.map((action, index) => (
                <div key={index}>
                  <a href={action.link} target="_blank">
                    <span>r/{action.obfuscated}</span>{" "}
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
  );
}

export default App;
