import { useEffect, useState } from "react";
import "./castVote.css";
import CandidateDetails from "./candidateDetails";
import { Candidate } from "../../types/candidate.type";
import { getContract } from "../../lib/getContract";

const CastVote = () => {
  const [voterID, setVoterID] = useState(0);
  const [partyIndex, setPartyIndex] = useState(0);
  const [candidateDetails, setCandidateDetails] = useState<Candidate[]>([]);

  const fetchCandidates = async () => {
    try {
      console.log("fired");
      const candidates: Candidate[] = [];
      const contract = await getContract();
      for (let i = 0; i < 5; i++) {
        const result = await contract.candidates(i);
        console.log(result);
        candidates.push({
          name: result[0],
          party: result[1],
          area: result[2],
          totalVotes: Number(result[3]),
        });
      }

      setCandidateDetails(candidates);
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const contract = await getContract();
      const result = await contract.castVote(voterID, partyIndex);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

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
        <p>Select Candidate</p>
        <div className="radioRow">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="radioGroup">
              <CandidateDetails
                candidate={candidateDetails[index]}
                value={index}
                currentValue={partyIndex}
                setter={setPartyIndex}
              />
            </div>
          ))}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CastVote;
