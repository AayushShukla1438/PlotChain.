import React, { useState, useEffect } from "react";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Button,
  CardActions,
  Box,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import backgroundImage from "../Assets/imgs/550947.jpg";

// The LandInspectorDashboard functional component serves as the main view for the land inspector role.
const LandInspectorDashboard = () => {
  // State hooks to manage web3, accounts, and contract instance.
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  // useNavigate hook to programmatically navigate using React Router.
  let navigate = useNavigate();

  // useEffect hook to initialize web3 and contract instances when the component is mounted.
  useEffect(() => {
    const initWeb3 = async () => {
        try {
          // Initialize web3 instance and set account and contract states.
            const web3Instance = await getWeb3(); // Your method to get the web3 instance
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
        } catch (error) {
          // Alert the user if there is an issue loading web3, accounts, or contract.
          alert(
            "Failed to load web3, accounts, or contract. Check console for details."
          );
          console.error(error);
        }
      };

      // Call the initWeb3 function to perform initialization.
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
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Box style={{ width: "50%", margin: "auto" }}>
        {/* Typography components display textual content on the page. */}
        <Typography
          variant="h3"
          component="h2"
          style={{ color: "#fff", paddingTop: "15%", paddingBottom: "5%", fontWeight: 'bold' }}
        >
          Land Inspector Dashboard
        </Typography>
        <Typography variant="h6" component="h2" style={{ color: "#fff" }}>
          Welcome, {accounts[0]} {/* Displaying the first account address */}
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          paddingTop: "7%",
          paddingLeft: "2%",
        }}
      >
        <Card style={{ margin: "20px", width: "600px", height: "350px" }}>
          <Box
            style={{
              height: "140px",
              backgroundColor: "blue",
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Pending Lands
            </Typography>
          </CardContent>
          <CardActions>
            {/* Buttons are used here to navigate to different views related to lands and sales. */}
            <Button
              component={Link}
              variant="contained"
              color="primary"
              to="/land-inspector-pending-lands"
              style={{
                marginBottom: "20px",
                margin: "auto",
              }}
            >
              View Pending Lands
            </Button>
          </CardActions>
        </Card>
        <Card style={{ margin: "20px", width: "600px", height: "350px" }}>
          <Box
            style={{
              height: "140px",
              backgroundColor: "yellow",
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Pending Sales
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              variant="contained"
              color="primary"
              to="/land-inspector-pending-sales"
              style={{
                marginBottom: "20px",
                margin: "auto",
              }}
            >
              View Pending Sales
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default LandInspectorDashboard;
