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

function createData(
  id,
  address,
  area,
  city,
  district,
  country,
  price,
  propertyID,
  status,
  action
) {
  return {
    id,
    address,
    area,
    city,
    district,
    country,
    price,
    propertyID,
    status,
    action,
  };
}

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
          let land = await contractInstance.methods.getLandDetails(i).call();
          let isApprovedByInspector = await contractInstance.methods
            .isLandApproved(i)
            .call();
          console.log("Land approved by inspector:", isApprovedByInspector);

          // Only add lands that have been approved by the inspector
          if (isApprovedByInspector) {
            // Fetch the request status if the land is requested
            let requested = await contractInstance.methods
              .isRequested(i)
              .call();
            let approved = await contractInstance.methods.isApproved(i).call();
            let saleApproved = await contractInstance.methods
              .isSaleApproved(i)
              .call();
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
        console.log("Owned Lands:", _lands);

        // Filter the lands owned by the buyer
        const ownedLands = _lands.filter((land) => land.owner === accounts[2]);
        console.log("Owned lands:", ownedLands);
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

  const getLandStatus = (land) => {
    if (!land.landApproved) {
      return "Pending Inspection";
    } else if (land.landApproved && !land.requested) {
      return "Not Requested";
    } else if (land.landApproved && land.requested && !land.approved) {
      return "Pending Approval";
    } else if (
      land.landApproved &&
      land.requested &&
      land.approved &&
      !land.saleApproved
    ) {
      return "Pending Sale Approval";
    } else if (
      land.landApproved &&
      land.requested &&
      land.approved &&
      land.saleApproved
    ) {
      return "Approved";
    }
  };

  // Method to approve land requests
  const approveLandRequest = async (landId) => {
    try {
      await contract.methods.approveRequest(landId).send({ from: accounts[2] });
      console.log("Land request approved successfully");
      alert("Land request approved successfully: " + landId);
      navigate("/seller-dashboard");
    } catch (error) {
      console.error("Error approving land request:", error);
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
              <StyledTableCell align="">Status</StyledTableCell>
              <StyledTableCell align="">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {landRequests.map((land, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{land.id}</StyledTableCell>
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
                  {getLandStatus(land)}
                </StyledTableCell>
                <StyledTableCell align="">
                  {land.requested ? (
                    !land.approved && (
                      <Button onClick={() => approveLandRequest(land.id)}>
                        Approve Request
                      </Button>
                    )
                  ) : (
                    <Button disabled>No Action Required</Button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SellerDashboard;
