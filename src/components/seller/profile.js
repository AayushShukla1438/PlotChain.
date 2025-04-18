import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Button, Box, Container } from '@mui/material';

const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [buyersCount, setBuyersCount] = useState(0); // State to store the number of sellers
  const [sellerDetails, setSellerDetails] = useState(null);

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
          .getSellerDetails(accounts[2])
          .call();
        console.log("Seller details:", details);
        setSellerDetails({
          name: details[0],
          age: details[1].toString(), // Convert BigNumber to string
          HKID: details[2],
        });

        // Fetch the number of sellers
        const buyerscount = await contractInstance.methods
          .getBuyersCount()
          .call();
        setBuyersCount(buyerscount);
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
        backgroundSize: 'cover',
        textAlign: "center",
      }}
    >
      <Box style={{ width: "50%", margin: "auto" }}>
        <Typography variant="h2" component="h2" style={{ color: "#000", marginBottom: "5%", paddingTop: "15%", }}>
          Your Profile
        </Typography>
      </Box>
      <Box style={{ width: "75%", margin: "auto", marginBottom: "3%", }}>
        <Typography variant="h6" component="h6">
          Wallet Address: &nbsp;
        </Typography>
        <Typography variant="h6" component="h6">
          {accounts[2]}
        </Typography>
      </Box>
      <Box
        height={300}
        width={200}
        my={4}
        gap={4}
        p={2}
        sx={{ border: '2px solid grey' }}
        style={{
          background: "#fff", width: " 35%", textAlign: "center", margin: "auto", boxShadow: "0px 2px 20px rgba(10, 10, 10, 10)", // Add box shadow
          borderRadius: "20px",
        }}>
        <Typography variant="h6" component="h2" style={{
          color: "#000",
          marginBottom: "30px", paddingTop: "20px",
        }}>
          Seller Profile
        </Typography>
        {sellerDetails && (
          <Box style={{marginBottom:"20px"}}>
            <Box style={{ display: "flex", flexDirection: "row", marginLeft: "40%", }}>
              <Typography variant="button" component="h2">
                Name:  &nbsp;
              </Typography>
                <Typography variant="button" component="h2">
                  {sellerDetails.name}
                </Typography>
            </Box>
            <Box style={{ display: "flex", flexDirection: "row", marginLeft: "40%" }}>
              <Typography variant="button" component="h2" style={{marginRight:"3%"}}>
              Age:  &nbsp;
              </Typography>
                <Typography variant="button" component="h2">
                {sellerDetails.age}
                </Typography>
            </Box>
            <Box style={{ display: "flex", flexDirection: "row", marginLeft: "40%" }}>
              <Typography variant="button" component="h2" style={{marginRight:"2%"}}>
              HKID:  &nbsp;
              </Typography>
                <Typography variant="button" component="h2">
                {sellerDetails.HKID}
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

export default SellerDashboard;