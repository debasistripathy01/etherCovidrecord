import React, { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x0fC5025C764cE34df352757e82f7B5c4Df39A836";
const CONTRACT_ABI = [
  [
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_date",
          type: "string",
        },
        {
          internalType: "string",
          name: "_location",
          type: "string",
        },
        {
          internalType: "string",
          name: "_vaccineType",
          type: "string",
        },
      ],
      name: "addRecord",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "deleteRecord",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
      ],
      name: "getRecords",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "date",
              type: "string",
            },
            {
              internalType: "string",
              name: "location",
              type: "string",
            },
            {
              internalType: "string",
              name: "vaccineType",
              type: "string",
            },
          ],
          internalType: "struct CovidVaccine.vaccineRecord[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
];
export const CovidVaccineData = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [provider, setProvider] = useState("");
  const [signer, setSigner] = useState("");
  const [vaccineType, setVaccineType] = useState("");
  const [contract, setContract] = useState(null);
  const [record, setRecord] = useState([]);

  async function connect() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    } else {
      alert("Please install MetaMask to use this app");
    }
  }
  //  Add new vaccine record for the current user

  async function addRecord() {
    const tx = await contract.addRecord(name, date, location, vaccineType);
    await tx.wait();
    alert("Record added successfully");
    setName("");
    setDate("");
    setLocation("");
    setVaccineType("");
  }

  async function getRecords() {
    const address = await signer.getAddress();
    const result = await contract.getRecords(address);
    setRecord(result);
  }
  async function deleteRecord(index) {
    const tx = await contract.deleteRecord(
      provider.getSigner().getAddress(),
      index
    );
    await tx.wait();
    alert("Record deleted successfully");
    getRecords();
  }

  const handleDelete = (index) => {
    deleteRecord(index);
  };

  return (
    <>
      <div>
        <h1>Covid vaccine record</h1>
        <button onClick={connect}>Connect to Ethereum Network</button>
        <div>
          <h1>Add new Record</h1>
          <form
            action="submit"
            onSubmit={(e) => {
              e.preventDefault();
              addRecord();
            }}
          >
            <label> Name: /</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label>Date: </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <br />
            <label>Location: </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <br />
            <label>Vaccine Type: </label>
            <input
              type="text"
              value={vaccineType}
              onChange={(e) => setVaccineType(e.target.value)}
            />
            <br />
            <button type="submit">Add Record</button>
          </form>
        </div>
        <div>
          <h2>Your Records</h2>
          <button onClick={getRecords}>Refresh Records</button>
          <table>
            {record.map((record, index) => (
              <tr key={index}>
                <td>{record.name}</td>
                <td>{record.date}</td>
                <td>{record.vaccineType}</td>
                <td>{record.location}</td>
                <td>{record.status}</td>
                {record.status === "approved" && (
                  <td>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </table>
        </div>
      </div>
    </>
  );
};
