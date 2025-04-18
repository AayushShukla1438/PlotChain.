import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Box, Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(id, address, area, city, district, country, price, propertyID, status, action) {
  return { id, address, area, city, district, country, price, propertyID, status, action };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 4, 4, 4, "approved", "tt"),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4, 4, 4, "approved", "tt"),
  createData('Eclair', 262, 16.0, 24, 6.0, 4, 4, 4, "approved", "tt"),
  createData('Cupcake', 305, 3.7, 67, 4.3, 4, 4, 4, "approved", "tt"),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 4, 4, 4, "approved", "tt"),
];

const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [lands, setLands] = useState([]);
  const [sellersCount, setSellersCount] = useState(0); // State to store the number of sellers
  const [ownedLands, setOwnedLands] = useState([]); // State to store the lands owned by the buyer
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

        // Fetch the number of sellers
        const sellersCount = await contractInstance.methods
          .getSellersCount()
          .call();
        setSellersCount(sellersCount);

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
          let landApprovalStatus = await contractInstance.methods
            .isLandApproved(i)
            .call();
          let saleApprovalStatus = await contractInstance.methods
            .isSaleApproved(i)
            .call();

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
            landApprovalStatus: landApprovalStatus,
            saleApprovalStatus: saleApprovalStatus,
          });
        }
        // Update the state with the fetched land details
        setLands(_lands);

        // Fetch the lands owned by the buyer
        const owned = _lands.filter((land) => land.owner === accounts[1]);
        setOwnedLands(owned);
      } catch (error) {
        alert(
          "Failed to load web3, accounts, or contract. Check console for details."
        );
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  // This asynchronous function handles the payment process for a land purchase.
  const makePayment = async (landId, price) => {
    try {
      // Retrieve the seller's address from the smart contract
      const sellerAddress = await contract.methods.getLandOwner(landId).call();

      // Then, make the payment to that address
      await contract.methods
        .payment(sellerAddress, landId)
        .send({ from: accounts[1], value: price, gas: "6721975" });
      console.log(`Payment for land with ID ${landId} was successful.`);
      const landsCount = await contract.methods.getLandsCount().call();
      const _lands = [];

      // Loop through all lands to fetch their details and update the UI accordingly.
      for (let i = 1; i <= parseInt(landsCount); i++) {
        let land = await contract.methods.getLandDetails(i).call();
        let isPaid = await contract.methods.isPaid(i).call();

        // Only add lands that have been approved by the inspector
        if (!isPaid) {
          // Further details about the land are fetched, such as request status and approvals.
          let requested = await contract.methods.isRequested(i).call();
          let approved = await contract.methods.isApproved(i).call();
          let saleApproved = await contract.methods.isSaleApproved(i).call();
          let owner = await contract.methods.getLandOwner(i).call();

          // Check whether the land has been approved by an inspector.
          let isApprovedByInspector = await contract.methods
            .isLandApproved(i)
            .call();

          // Combine the land details with its request and sale approval status
          _lands.push({
            id: land[0],
            landAddress: land[1],
            area: land[2],
            city: land[3],
            district: land[4],
            country: land[5],
            landPrice: land[6],
            propertyPID: land[7],
            requested: requested,
            saleApproved: saleApproved,
            approved: approved,
            landApproved: isApprovedByInspector,
            owner: owner,
          });
        }
      }
      setLands(_lands);

      alert("Payment successful: " + price);
      navigate("/buyer-dashboard")
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <Container maxWidth={false}
    style={{
      background: "#ffebb2",
      width: "100vw",
      height: "100vh",
      backgroundRepeat: "no-repeat",
      backgroundSize: 'cover',
      textAlign: "center",
    }}
    >
          <Box style={{width: "50%", margin:"auto"}}>
      <Typography variant="h3" component="h2" style={{ color: "#000", marginBottom: "3%", paddingTop: "10%"}}>
        Your Land Requests
      </Typography>
      </Box>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Land ID</StyledTableCell>
            <StyledTableCell align="">Land Address</StyledTableCell>
            <StyledTableCell align="">Area</StyledTableCell>
            <StyledTableCell align="">City</StyledTableCell>
            <StyledTableCell align="">District</StyledTableCell>
            <StyledTableCell align="">Country</StyledTableCell>
            <StyledTableCell align="">Price</StyledTableCell>
            <StyledTableCell align="">Property ID</StyledTableCell>
            <StyledTableCell align="">Status</StyledTableCell>
            <StyledTableCell align="">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lands
            .filter((land) => land.requested) // Only include lands that have been requested
            .map((land, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>
                {land.id}
              </StyledTableCell>
              <StyledTableCell align="">
                <Typography noWrap>{land.landAddress}</Typography>
              </StyledTableCell>
              <StyledTableCell align="">{land.area}</StyledTableCell>
              <StyledTableCell align="">{land.city}</StyledTableCell>
              <StyledTableCell align="">{land.district}</StyledTableCell>
              <StyledTableCell align="">{land.country}</StyledTableCell>
              <StyledTableCell align="">{land.landPrice}</StyledTableCell>
              <StyledTableCell align="">{land.propertyPID}</StyledTableCell>
              <StyledTableCell align="">
              {land.approved ? "Approved" : "Pending Approval"}
                </StyledTableCell>
              <StyledTableCell align="">
              <Button
                  onClick={() => makePayment(land.id, land.landPrice)}
                  disabled={!land.approved} // The button is disabled if the request is not approved
                >
                  {land.approved ? "Pay" : "Awaiting Approval"}
                </Button>
                </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </Container>
  );
};

export default BuyerRegistration;