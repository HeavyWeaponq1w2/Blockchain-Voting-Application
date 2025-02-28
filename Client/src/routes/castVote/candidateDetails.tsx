import { Candidate } from "../../types/candidate.type";

const CandidateDetails = (props: {
  candidate?: Candidate;
  value: number;
  setter: (value: React.SetStateAction<number>) => void;
  currentValue: number;
}) => {
  return (
    <div className="candidate">
      <input
        checked={props.currentValue === props.value}
        onChange={(e) => props.setter(parseInt(e.target.value))}
        type="radio"
        value={props.value}
      ></input>
      <label>Candidate {props.value + 1}</label>
      {props.candidate && (
        <div className="candidateDetails">
          <p>
            <b>Name:</b> {props.candidate.name}
          </p>
          <p>
            <b>Party: </b> {props.candidate.party}
          </p>
          <p>
            <b>Area: </b> {props.candidate.area}
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;
