import React, { useState, useEffect } from "react";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActions, Box, Container } from '@mui/material';
import { Link } from "react-router-dom";
import backgroundImage from "../Assets/imgs/pexels-nextvoyage-872698.jpg";

// Component for buyer dashboard
const BuyerRegistration = () => {
  // State hooks to manage component state
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  // Additional state variables can be declared here
  const [lands, setLands] = useState([]);
  // State to store the number of sellers
  const [sellersCount, setSellersCount] = useState(0);
  // State to store the lands owned by the buyer
  const [ownedLands, setOwnedLands] = useState([]);
  // State to store the buyer's personal details
  const [buyerDetails, setBuyerDetails] = useState(null);

  // Hook to navigate programmatically
  let navigate = useNavigate();

  // Effect hook to initialize web3, accounts, and contract
  useEffect(() => {
    // Function to initialize web3
    const initWeb3 = async () => {
      try {
        // Getting web3 instance
        const web3Instance = await getWeb3();
        // Fetching accounts from the web3 instance
        const accounts = await web3Instance.eth.getAccounts();
        // Getting the network ID
        const networkId = await web3Instance.eth.net.getId();
        // Getting the deployed network based on network ID
        const deployedNetwork = LandContract.networks[networkId];
        // Creating a contract instance
        const contractInstance = new web3Instance.eth.Contract(
          LandContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Setting up state with web3, accounts, and contract instance
        setWeb3(web3Instance);
        setAccounts(accounts);
        setContract(contractInstance);

        // Fetch buyer details and set state
        const details = await contractInstance.methods
          .getBuyerDetails(accounts[1])
          .call();
        setBuyerDetails({
          name: details[0],
          city: details[1],
          email: details[2],
          age: details[3].toString(), // Convert BigNumber to string
          HKID: details[4],
        });

        // Fetch the number of sellers from the contract and update state
        const sellersCount = await contractInstance.methods
          .getSellersCount()
          .call();
        setSellersCount(sellersCount);

        // Fetch the total number of lands and iterate to get details of each land
        const landsCount = await contractInstance.methods
          .getLandsCount()
          .call();
        const _lands = [];
        for (let i = 1; i <= parseInt(landsCount); i++) {
          // Fetch details for each land
          let land = await contractInstance.methods.getLandDetails(i).call();
          // Check if the land has been requested
          let requested = await contractInstance.methods.isRequested(i).call();
          // Fetch the land owner's address
          let owner = await contractInstance.methods.getLandOwner(i).call();
          let approved = await contractInstance.methods.isApproved(i).call();

          // Combine the land details with its requested status and owner's address, and push to the _lands array
          _lands.push({
            id: land[0],
            landAddress: land[1],
            area: land[2],
            city: land[3],
            district: land[4],
            country: land[5],
            landPrice: land[6],
            propertyPID: land[7],
            owner: owner,
            requested: requested,
            approved: approved,
          });
        }
        // Update state with the lands information
        setLands(_lands);

        // Filter lands that are owned by the buyer and update state
        const owned = _lands.filter((land) => land.owner === accounts[1]);
        setOwnedLands(owned);
      } catch (error) {
        // Error handling
        alert(
          "Failed to load web3, accounts, or contract. Check console for details."
        );
        console.error(error);
      }
    };

    // Initialize web3 on component mount
    initWeb3();
  }, []);

  return (
    <Container maxWidth={false}
      style={{
        background: "#ffebb2",
        width: "100vw",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: 'cover',
        textAlign: "center",
        backgroundImage: `url(${backgroundImage})`,
      }}>
      <Box style={{ width: "50%", margin: "auto" }}>
        <Typography variant="h3" component="h2" style={{ color: "#000", paddingTop: "15%", paddingBottom: "5%", fontWeight: 'bold' }}>
          Buyer Dashboard
        </Typography>
        <Typography variant="h6" component="h2" style={{ color: "#000" }}>
          Welcome, {accounts[1]}
        </Typography>
      </Box>
      <Box style={{ display: "flex", flexDirection: "row", paddingTop: "7%", paddingLeft: "2%" }}>
        <Card style={{ margin: "20px", width: "600px", height: "350px" }}>
            <Box
              style={{
                height: "140px",
                backgroundColor: "blue",
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Profile
              </Typography>
            </CardContent>
          <CardActions>
            <Button component={Link}
              variant="contained"
              color="primary"
              to="/buyer-profile"
              style={{
                marginBottom: "20px",
                margin: "auto"
              }}>
              View Profile
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
                Owned Lands
              </Typography>
            </CardContent>
          <CardActions>
            <Button component={Link}
              variant="contained"
              color="primary"
              to="/buyer-owned-lands"
              style={{
                marginBottom: "20px",
                margin: "auto"
              }}>
              View Owned Lands
            </Button>
          </CardActions>
        </Card>
        <Card style={{ margin: "20px", width: "600px", height: "350px" }}>
            <Box
              style={{
                height: "140px",
                backgroundColor: "green",
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Available Lands
              </Typography>
            </CardContent>
          <CardActions>
            <Button component={Link}
              variant="contained"
              color="primary"
              to="/buyer-available-lands"
              style={{
                marginBottom: "20px",
                margin: "auto"
              }}>
              View Available Lands
            </Button>
          </CardActions>
        </Card>
        <Card style={{ margin: "20px", width: "600px", height: "350px" }}>
            <Box
              style={{
                height: "140px",
                backgroundColor: "red",
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                View Land Requests
              </Typography>
            </CardContent>
          <CardActions>
            <Button component={Link}
              variant="contained"
              color="primary"
              to="/buyer-land-requests"
              style={{
                marginBottom: "20px",
                margin: "auto"
              }}>
              View Land Requests
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default BuyerRegistration;
