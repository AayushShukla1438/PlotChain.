import React, { useState, useEffect } from "react";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActions, Box, Container } from '@mui/material';
import { Link } from "react-router-dom";
import backgroundImage from "../Assets/imgs/hong-kong-wallpaper.jpg"

const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [buyersCount, setBuyersCount] = useState(0);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [landRequests, setLandRequests] = useState([]);

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
            owner: owner, // Add the land owner's address
            requested: requested,
            approved: approved,
          });
        }

        // Filter the lands owned by the buyer
        const ownedLands = _lands.filter((land) => land.owner === accounts[2]);
        setLandRequests(ownedLands);
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
      Seller Dashboard
      </Typography>
      <Typography variant="h6" component="h2" style={{ color: "#000" }}>
        Welcome, {accounts[2]}
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
            to="/seller-profile"
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
            to="/seller-owned-lands"
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
              Add Lands
            </Typography>
          </CardContent>
        <CardActions>
          <Button component={Link}
            variant="contained"
            color="primary"
            to="/seller-land-add"
            style={{
              marginBottom: "20px",
              margin: "auto"
            }}>
            Add Lands
          </Button>
        </CardActions>
      </Card>
    </Box>
  </Container>
  );
};

export default SellerDashboard;
