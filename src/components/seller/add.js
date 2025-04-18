import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Button, Box, Container } from '@mui/material';

// 'SellerDashboard' is a functional component representing the seller's interface.
const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [buyersCount, setBuyersCount] = useState(0); // State to store the number of sellers
  const [sellerDetails, setSellerDetails] = useState(null);
  const [landAddress, setLandAddress] = useState(""); // New state for storing land address
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [country, setCountry] = useState("");
  const [landPrice, setLandPrice] = useState("");
  const [propertyPID, setPropertyPID] = useState("");
  const [landRequests, setLandRequests] = useState([]); // New state for storing land requests

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
        alert(error);
      }
    };

    initWeb3();
  }, []);

  const handleAddLand = async (e) => {
    e.preventDefault();

    if (!contract) {
      alert("Contract is not initialized.");
      return;
    }

    if (!accounts[2]) {
      alert("Account is not available.");
      return;
    }

    try {
      console.log(accounts[2]); // Log the account being used
      await contract.methods
        .addLand(landAddress, area, city, district, country, landPrice, propertyPID)
        .send({ from: accounts[2], gas: "6721975" });

      console.log("Land added successfully");
      const landCount = await contract.methods.getLandsCount().call();
      console.log("Land count:", landCount);
      alert("Land added successfully: " + propertyPID);
      navigate("/seller-dashboard");
    } catch (error) {
      console.error("Error adding land:", error);
      alert("Error adding land.");
    }
  };

  return (
    <Container
    maxWidth={false}
    style={{
      background: "#F3D0D7",
      width: "100vw",
      height: "100vh",
      backgroundRepeat: "no-repeat",
      backgroundSize: 'cover',
      textAlign: "center",
    }}
  >
      <Box style={{width: "50%", margin:"auto"}}>
      <Typography variant="h2" component="h2" style={{ color: "#000", marginBottom: "3%", paddingTop: "15%" }}>
        Add Land
      </Typography>
      </Box>
      <Box
        height={450}
        width={200}
        my={4}
        gap={4}
        p={2}
        sx={{ border: '2px solid grey' }}
        style={{ background: "#fff", width: " 35%", textAlign: "center", margin: "auto", boxShadow: "0px 2px 20px rgba(10, 10, 10, 10)", borderRadius: "20px" }}>
        <Typography variant="h6" component="h2" style={{ color: "#000", marginBottom: "30px", paddingTop: "20px" }}>
          Add Land
        </Typography>
        <form onSubmit={handleAddLand}>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={landAddress}
            onChange={(e) => setLandAddress(e.target.value)}
            required
            style={{ marginLeft: "20px", marginBottom: "20px" }}
          />
        </div>
        <div>
          <label>Area:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            style={{ marginLeft: "7%", marginBottom: "20px" }}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            style={{ marginLeft: "8%", marginBottom: "20px" }}
          />
        </div>
        <div>
          <label>District:</label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            style={{ marginLeft: "5%", marginBottom: "20px" }}
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            style={{ marginLeft: "4%", marginBottom: "20px" }}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={landPrice}
            onChange={(e) => setLandPrice(e.target.value)}
            required
            style={{ marginLeft: "8%", marginBottom: "20px" }}
          />
        </div>
        <div>
          <label>Property ID:</label>
          <input
            type="text"
            value={propertyPID}
            onChange={(e) => setPropertyPID(e.target.value)}
            required
            style={{ marginLeft: "2%", marginBottom: "30px" }}
          />
        </div>
        <Button
            variant="contained"
            color="primary"
            style={{
              marginBottom: "20px",
            }}
            type="submit"
          >
            Add Land
          </Button>
      </form>
      </Box>
    </Container>
  );
};

export default SellerDashboard;
