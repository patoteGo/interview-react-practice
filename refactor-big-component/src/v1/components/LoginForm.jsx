const LoginForm = ({setCompanyNumber, handleSubmitCompanyNumber, companyNumber, numberIncorrect}) => {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="company_number">Enter your credentials</label>
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
        ""
      )}
    </form>
  );
};

export default LoginForm;
