import { formatDate } from "./utils";

const useApi = ({ formData }) => {
  const [recentActions, setRecentActions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [companyNumber, setCompanyNumber] = useState("");
	const [numberIncorrect, setNumberIncorrect] = useState(0);

  const handleCancelaction = () => {
    if (abortController) {
      abortController.abort(); // Abort the fetch request
    }
    setShowOverlay(false);
    setIsProcessing(false);
  };

  const handleSubmitCompanyNumber = (number) => {
    // this is unneeded, we've already set the value in state
    setCompanyNumber(number);
    if (number.length < 9) setNumberIncorrect(1);
    else setNumberIncorrect(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    setShowOverlay(true);
    setIsProcessing(true);

    // Construct the form data object

    // Calling the API with the form data
    await callBackendAPI(formData);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (recentActions.length === 0) {
      fetchPreviousActions();
    }

    setIsFormValid(startDate && endDate && endDate > startDate);
  }, [numberOfVisits, startDate, endDate]);

  const fetchPreviousActions = async () => {
    try {
      const response = await fetch("https://api.com/actions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      data.sort((a, b) => new Date(b.actiond_date) - new Date(a.actiond_date));
      setRecentActions(data);
    } catch (error) {
      console.error("Failed to fetch recent actions", error);
    }
  };

  const callBackendAPI = async (formData) => {
    const controller = new AbortController();
    setAbortController(controller);
    formData.startDate = formatDate(formData.startDate);
    formData.endDate = formatDate(formData.endDate);

    try {
      const response = await fetch("https://api.com/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShowOverlay(false);
      window.open(
        "https://app.com/action/" + data.id,
        "_blank",
        "noopener,noreferrer",
      );
      window.location.reload();
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Scraping halted");
      } else {
        console.error("Failed to call the API", error);
      }
    } finally {
      setShowOverlay(false);
      setIsProcessing(false);
    }
  };

  return {
    handleSubmit,
    fetchPreviousActions,
    callBackendAPI,
    recentActions,
    setRecentActions,
		isProcessing,
	  handleSubmitCompanyNumber,
		companyNumber,
		setCompanyNumber,
		numberIncorrect,
  };
};

export default useApi;
