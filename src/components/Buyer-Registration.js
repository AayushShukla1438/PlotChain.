// src/components/BuyerRegistration.js
import React, { useState, useEffect } from "react";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../Assets/imgs/1270244.jpg";
import { Box, Typography, Container, Button } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [HKID, setHKID] = useState("");
  const [email, setEmail] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = LandContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          LandContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setWeb3(web3Instance);
        setAccounts(accounts);
        setContract(contractInstance);
        console.log(accounts);
        console.log(contractInstance);
      } catch (error) {
        alert(
          "Failed to load web3, accounts, or contract. Check console for details."
        );
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      console.log(accounts[1]);
      await contract.methods
        .registerBuyer(name, age, city, HKID, email)
        .send({ from: accounts[1], gas: "6721975" });

      console.log("Buyer registered successfully");
      navigate("/buyer-dashboard");
      const buyercount = await contract.methods.getBuyersCount().call();
      console.log("Buyer count:", buyercount);
    } catch (error) {
      console.error("Error registering buyer:", error);
    }
  };

  return (
    <Container
      maxWidth={false}
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        width: "100vw",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        textAlign: "center",
        paddingTop: '15%'
      }}
    >
      <Box
        height={430}
        width={200}
        my={4}
        gap={4}
        p={2}
        sx={{ border: "2px solid grey" }}
        style={{
          background: "#fff",
          width: " 35%",
          textAlign: "center",
          margin: "auto",
          boxShadow: "0px 2px 20px rgba(10, 10, 10, 10)", // Add box shadow
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          style={{ color: "#000", fontWeight: 'bold', paddingTop: '10px'}}
        >
          Buyer Registration
        </Typography>
        <Typography
          component="h2"
          style={{ color: "#000", marginBottom: "30px", paddingTop: "20px", fontWeight: 'bolder' }}
        >
          <i>Wallet address being used:</i> {accounts[1]}
        </Typography>
        <form onSubmit={handleRegister}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginLeft: "20px", marginBottom: "20px" }}
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              style={{ marginLeft: "33px", marginBottom: "20px" }}
            />
          </div>
          <div>
            <label>City:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              style={{ marginLeft: "30px", marginBottom: "20px" }}
            />
          </div>
          <div>
            <label>HKID:</label>
            <input
              type="text"
              value={HKID}
              onChange={(e) => setHKID(e.target.value)}
              required
              style={{ marginLeft: "23px", marginBottom: "20px" }}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginLeft: "20px", marginBottom: "30px" }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginBottom: "20px",
            }}
            type="submit"
            onSubmit={handleRegister}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default BuyerRegistration;
