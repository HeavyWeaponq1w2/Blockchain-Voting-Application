import { useState } from "react";
import "./voting.css";
import { getContract } from "../../lib/getContract";
import { useNavigate } from "react-router";
const Voting = () => {
  const [voterID, setVoterID] = useState(0);
  const [name, setName] = useState("");
  const [aadharNumber, setAadharNumber] = useState(0);
  const navigator = useNavigate();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const contract = await getContract();
      const result = await contract.registerVoter(voterID, name, aadharNumber);
      console.log(result);
      navigator("/castVote");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="votingWrapper">
      <h1>Voting Registration</h1>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="VoterID">Voter ID</label>
          <input
            id="VoterID"
            type="number"
            value={voterID}
            onChange={(e) => setVoterID(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="Name">Name</label>
          <input
            id="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="AadharNumber">Aadhar Number</label>
          <input
            id="AadharNumber"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(parseInt(e.target.value))}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Voting;
