import { useEffect, useState } from "react";
import { Candidate } from "../../types/candidate.type";
import { ethers } from "ethers";
import { getContract } from "../../lib/getContract";
import "./adminPanel.css";

const AdminPanel = () => {
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

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div className="adminWrapper">
      <h1>Total Votes</h1>
      <button onClick={() => fetchCandidates()} type="button">
        Refresh
      </button>
      <div className="candidateRow">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="candidateAdmin">
            <h4>Candidate {index + 1}</h4>
            <div>
              {candidateDetails.length > index && (
                <>
                  <p>
                    <b>Name:</b> {candidateDetails[index].name}
                  </p>
                  <p>
                    <b>Party: </b> {candidateDetails[index].party}
                  </p>
                  <p>
                    <b>Area: </b> {candidateDetails[index].area}
                  </p>
                  <p>
                    <b>Total Votes: </b> {candidateDetails[index].totalVotes}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
