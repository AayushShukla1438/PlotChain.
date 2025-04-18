import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/Landing-Page";
import Buyer from "./components/Buyer-Registration";
import Seller from "./components/Seller-Registration";
import BuyerDashboard from "./components/Buyer-Dashboard";
import SellerDashboard from "./components/Seller-Dashboard";
import BuyerProfile from "./components/buyer/profile";
import BuyerOwned from "./components/buyer/owned";
import BuyerAvailable from "./components/buyer/available";
import BuyerRequest from "./components/buyer/request";
import SellerProfile from "./components/seller/profile";
import SellerOwned from "./components/seller/owned";
import SellerAddLands from "./components/seller/add"
import LandInspectorDashboard from "./components/Land-Inspector-Dashboard";
import PendingLands from "./components/landInspector/pendingLands";
import PendingSales from "./components/landInspector/pendingSale";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route path="/buyer" element= {<Buyer />} />
        <Route path="/seller" element= {<Seller />} />
        <Route path="/buyer-dashboard" element= {<BuyerDashboard />} />
        <Route path="/seller-dashboard" element= {<SellerDashboard />} />
        <Route path="/buyer-profile" element= {<BuyerProfile />} />
        <Route path="/buyer-owned-lands" element= {<BuyerOwned />} />
        <Route path="/buyer-available-lands" element= {<BuyerAvailable />} />
        <Route path="/buyer-land-requests" element= {<BuyerRequest />} />
        <Route path="/seller-profile" element= {<SellerProfile />} />
        <Route path="/seller-owned-lands" element= {<SellerOwned />} />
        <Route path="/seller-land-add" element= {<SellerAddLands />} />
        <Route path="/land-inspector-dashboard" element= {<LandInspectorDashboard />} />
        <Route path="/land-inspector-pending-lands" element= {<PendingLands />} />
        <Route path="/land-inspector-pending-sales" element= {<PendingSales />} />
      </Routes>
    </Router>
  );
};

export default App;
