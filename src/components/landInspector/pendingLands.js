import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, Container, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// 'PendingLands' is a functional component that displays lands pending inspection
const PendingLands = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [pendingLands, setPendingLands] = useState([]);

  let navigate = useNavigate();

  // useEffect hook to initialize web3 and fetch pending lands on component mount
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

        // Fetch lands and sales that are pending inspection
        const landsCount = await contractInstance.methods
          .getLandsCount()
          .call();
        let _pendingLands = [];
        for (let i = 1; i <= landsCount; i++) {
          let landApproved = await contractInstance.methods
            .isLandApproved(i)
            .call();
          if (!landApproved) {
            let land = await contractInstance.methods.getLandDetails(i).call();
            let isApprovedByInspector = await contractInstance.methods
              .isLandApproved(i)
              .call();
            let requested = await contractInstance.methods
              .isRequested(i)
              .call();
            let approved = await contractInstance.methods.isApproved(i).call();
            let saleApproved = await contractInstance.methods
              .isSaleApproved(i)
              .call();
            let owner = await contractInstance.methods.getLandOwner(i).call();
            let sellerDetails = await contractInstance.methods
              .getSellerDetails(owner)
              .call();

            _pendingLands.push({
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
              sellerName: sellerDetails[0],
              sellerAge: sellerDetails[1],
              sellerHKID: sellerDetails[2],
            });
          }
        }

        setPendingLands(_pendingLands);
      } catch (error) {
        alert(
          "Failed to load web3, accounts, or contract. Check console for details."
        );
        console.error(error);
      }
    };

    // Call the function to initialize web3 and fetch data
    initWeb3();
  }, []);

  // Function to approve a land by its ID
  const approveLand = async (landId) => {
    // Send a transaction to the blockchain to approve the land with the given ID
    // The transaction is initiated from the first account in the 'accounts' array
    await contract.methods.approveLand(landId).send({ from: accounts[0] });
    // Reload the pending lands
    const landsCount = await contract.methods.getLandsCount().call();
    let _pendingLands = [];
    for (let i = 1; i <= landsCount; i++) {
      let landApproved = await contract.methods.isLandApproved(i).call();
      if (!landApproved) {
        let land = await contract.methods.getLandDetails(i).call();
        let isApprovedByInspector = await contract.methods
          .isLandApproved(i)
          .call();
        let requested = await contract.methods.isRequested(i).call();
        let approved = await contract.methods.isApproved(i).call();
        let saleApproved = await contract.methods.isSaleApproved(i).call();
        let owner = await contract.methods.getLandOwner(i).call();
        let sellerDetails = await contract.methods
          .getSellerDetails(owner)
          .call();
      // Consolidate all retrieved land and seller details into an object
      // and add it to the _pendingLands array
        _pendingLands.push({
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
          sellerName: sellerDetails[0],
          sellerAge: sellerDetails[1],
          sellerHKID: sellerDetails[2],
        });
      }
    }
    // Update the state with the new list of pending lands
    setPendingLands(_pendingLands);
    // Notify the user that the land has been approved successfully
    alert("Land approved successfully: " + landId);
    // Navigate the user to the land inspector dashboard using React Router
    navigate("/land-inspector-dashboard");
  };

  return (
    <Container
      maxWidth={false}
      style={{
        background: "#E3FEF7",
        width: "100vw",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        textAlign: "center",
      }}
    >
      <Box style={{ width: "50%", margin: "auto" }}>
        <Typography
          variant="h3"
          component="h2"
          style={{ color: "#000", marginBottom: "3%", paddingTop: "10%" }}
        >
          Pending Lands
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell align="">Address</StyledTableCell>
              <StyledTableCell align="">District</StyledTableCell>
              <StyledTableCell align="">Country</StyledTableCell>
              <StyledTableCell align="">Price</StyledTableCell>
              <StyledTableCell align="">Property ID</StyledTableCell>
              <StyledTableCell align="">Seller Name</StyledTableCell>
              <StyledTableCell align="">Seller HKID</StyledTableCell>
              <StyledTableCell align="">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingLands.map((land, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{land.id}</StyledTableCell>
                <StyledTableCell align="">
                  <Typography noWrap>{land.landAddress}</Typography>
                </StyledTableCell>
                <StyledTableCell align="">{land.district}</StyledTableCell>
                <StyledTableCell align="">{land.country}</StyledTableCell>
                <StyledTableCell align="">{land.landPrice}</StyledTableCell>
                <StyledTableCell align="">{land.propertyPID}</StyledTableCell>
                <StyledTableCell align="">{land.sellerName}</StyledTableCell>
                <StyledTableCell align="">{land.sellerHKID}</StyledTableCell>
                <StyledTableCell align="">
                  <Button onClick={() => approveLand(land.id)}>
                    Approve Land
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

export default PendingLands;
