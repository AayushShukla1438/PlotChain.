import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Button, Box, Container } from "@mui/material";

// Buyer dashboard component
const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [buyerDetails, setBuyerDetails] = useState(null);

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

        const details = await contractInstance.methods
          .getBuyerDetails(accounts[1])
          .call();
        console.log("Buyer details:", details);
        setBuyerDetails({
          name: details[0],
          city: details[1],
          email: details[2],
          age: details[3].toString(), // Convert BigNumber to string
          HKID: details[4],
        });
      } catch (error) {
        alert(
          "Failed to load web3, accounts, or contract. Check console for details."
        );
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  return (
    <Container
      maxWidth={false}
      style={{
        background: "#ffebb2",
        width: "100vw",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        textAlign: "center",
      }}
    >
      <Box style={{ width: "50%", margin: "auto" }}>
        <Typography
          variant="h2"
          component="h2"
          style={{ color: "#000", marginBottom: "5%", paddingTop: "15%" }}
        >
          Your Profile
        </Typography>
      </Box>
      <Box style={{ width: "75%", margin: "auto", marginBottom: "3%", }}>
        <Typography variant="h6" component="h6">
          Wallet Address: &nbsp;
        </Typography>
        <Typography variant="h6" component="h6">
          {accounts[1]}
        </Typography>
      </Box>
      <Box
        height={300}
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
          variant="h6"
          component="h2"
          style={{
            color: "#000",
            marginBottom: "30px",
            paddingTop: "20px",
          }}
        >
          Buyer Profile
        </Typography>
        {buyerDetails && (
          <Box style={{ marginBottom: "20px" }}>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "40%",
              }}
            >
              <Typography variant="button" component="h2">
                Name: &nbsp;
              </Typography>
              <Typography variant="button" component="h2">
                {buyerDetails.name}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "40%",
              }}
            >
              <Typography
                variant="button"
                component="h2"
                style={{ marginRight: "3%" }}
              >
                Age: &nbsp;
              </Typography>
              <Typography variant="button" component="h2">
                {buyerDetails.age}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "40%",
              }}
            >
              <Typography
                variant="button"
                component="h2"
                style={{ marginRight: "2%" }}
              >
                City: &nbsp;
              </Typography>
              <Typography variant="button" component="h2">
                {buyerDetails.city}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "40%",
              }}
            >
              <Typography
                variant="button"
                component="h2"
                style={{ marginRight: "2%" }}
              >
                HKID: &nbsp;
              </Typography>
              <Typography variant="button" component="h2">
                {buyerDetails.HKID}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "40%",
              }}
            >
              <Typography variant="button" component="h2">
                Email: &nbsp;
              </Typography>
              <Typography variant="button" component="h2">
                {buyerDetails.email}
              </Typography>
            </Box>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          style={{
            marginBottom: "20px",
          }}
        >
          Edit Profile
        </Button>
      </Box>
    </Container>
  );
};

export default BuyerRegistration;
