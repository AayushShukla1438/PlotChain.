import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Custom styled table cell components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Custom styled table row components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Utility function to create a structured object for table rows
function createData(id, address, area, city, district, country, price, propertyID) {
  return { id, address, area, city, district, country, price, propertyID };
}

// Sample data for the table, replace with actual data fetch
const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 4, 4, 4),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4, 4, 4),
  createData('Eclair', 262, 16.0, 24, 6.0, 4, 4, 4),
  createData('Cupcake', 305, 3.7, 67, 4.3, 4, 4, 4),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 4, 4, 4),
];

// Buyer dashboard component
const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [lands, setLands] = useState([]);
  const [sellersCount, setSellersCount] = useState(0); // State to store the number of sellers
  const [ownedLands, setOwnedLands] = useState([]); // State to store the lands owned by the buyer
  const [buyerDetails, setBuyerDetails] = useState(null);

  let navigate = useNavigate();

  // Effect hook to initialize web3, contract, and load lands
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
          let land = await contractInstance.methods.getLandDetails(i).call();
        let isApprovedByInspector = await contractInstance.methods.isLandApproved(i).call();

        // Only add lands that have been approved by the inspector
        if (isApprovedByInspector) {
          // Fetch the request status if the land is requested
          let requested = await contractInstance.methods.isRequested(i).call();
          let approved = await contractInstance.methods.isApproved(i).call();
          let saleApproved = await contractInstance.methods.isSaleApproved(i).call();
          let owner = await contractInstance.methods.getLandOwner(i).call();

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
            approved: approved,
            saleApproved: saleApproved,
            landApproved: isApprovedByInspector,
            owner: owner,
          });
        }
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
        Owned Lands
      </Typography>
      </Box>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="">Address</StyledTableCell>
            <StyledTableCell align="">Area</StyledTableCell>
            <StyledTableCell align="">City</StyledTableCell>
            <StyledTableCell align="">District</StyledTableCell>
            <StyledTableCell align="">Country</StyledTableCell>
            <StyledTableCell align="">Price</StyledTableCell>
            <StyledTableCell align="">Property ID</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ownedLands.map((land, index) => (
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
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </Container>
  );
};

export default BuyerRegistration;
