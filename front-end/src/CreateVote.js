import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

const CreateVote = ({ contract }) => {
  const [uri, setUri] = useState("");
  const [option, setOption] = useState(2);
  const [endTime, setEndTime] = useState("");

  const handleSubmit = () => {
    if (!contract) {
      alert("Please connect metamask");
    }
    contract
      .createVote(uri, option, new Date(endTime).getTime())
      .then(() => alert("success"))
      .catch((error) => alert(error.message));
  };

  return (
    <Form className="m2">
      <h3 className="d-flex justify-content-center m-2 mt-2">Enter URI</h3>
      <Form.Group className="m-2">
        <Form.Label htmlFor="uri">IPFS Uri</Form.Label>
        <Form.Control
          name="uri"
          type="text"
          placeholder="Enter URI"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group className="m-2">
        <Form.Label htmlFor="option">Option</Form.Label>
        <Form.Control
          name="option"
          type="number"
          min={2}
          max={8}
          placeholder="Enter Option"
          value={option}
          onChange={(e) => setOption(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group className="m-2">
        <Form.Label htmlFor="date">Date</Form.Label>
        <Form.Control
          name="date"
          type="date"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group className="m-2 mt-2">
        <Button variant="success" className="mt-2 m-2" onClick={handleSubmit}>
          Create
        </Button>
      </Form.Group>
    </Form>
  );
};

export default CreateVote;
