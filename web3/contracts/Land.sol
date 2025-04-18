pragma solidity >=0.5.2;
pragma experimental ABIEncoderV2;

contract Land {
    struct Landreg {
        uint id;
        string landAddress;
        string area;
        string city;
        string district;
        string country;
        uint landPrice;
        string propertyID;
    }

    struct Buyer {
        address id;
        string name;
        uint age;
        string city;
        string HKID;
        string email;
    }

    struct Seller {
        address id;
        string name;
        uint age;
        string HKID;
    }

    struct LandRequest {
        uint reqId;
        address sellerId;
        address buyerId;
        uint landId;
    }

    address public landInspector;

    //key value pairs
    mapping(uint => Landreg) public lands;
    mapping(address => Seller) public SellerMapping;
    mapping(address => Buyer) public BuyerMapping;
    mapping(uint => LandRequest) public RequestsMapping;

    // New mapping to track unique property IDs
    mapping(string => bool) private propertyIDExists;

    mapping(address => bool) public RegisteredAddressMapping;
    mapping(address => bool) public RegisteredSellerMapping;
    mapping(address => bool) public RegisteredBuyerMapping;
    mapping(uint => address) public LandOwner;
    mapping(uint => bool) public RequestStatus;
    mapping(uint => bool) public RequestedLands;
    mapping(uint => bool) public PaymentReceived;

    mapping(uint => bool) public landApprovalStatus; // Tracks if land is approved by the land inspector
    mapping(uint => bool) public saleApprovalStatus; // Tracks if the sale is approved by the land inspector

    // address public Land_Inspector;
    address[] public sellers;
    address[] public buyers;

    uint public landsCount;
    // uint public inspectorsCount;
    uint public sellersCount;
    uint public buyersCount;
    uint public requestsCount;

    event Registration(address _registrationId);
    event AddingLand(uint indexed _landId);
    event Landrequested(address _sellerId);
    event requestApproved(address _buyerId);
    event LandOwnershipTransferred(
        uint indexed landId,
        address indexed seller,
        address indexed buyer
    );

    event LandAdded(uint indexed _landId, address indexed _seller);
    event LandApproved(uint indexed _landId);
    event SaleRequested(
        uint indexed _landId,
        address indexed _seller,
        address indexed _buyer
    );
    event SaleApproved(
        uint indexed _landId,
        address indexed _seller,
        address indexed _buyer
    );
    event PaymentMade(
        uint indexed _landId,
        address indexed _seller,
        address indexed _buyer
    );

    // Constructor to set the deployer as the initial land inspector
    constructor() public {
        landInspector = msg.sender;
    }

    // Modifier to check if the caller is the land inspector
    modifier onlyLandInspector() {
        require(
            msg.sender == landInspector,
            "Caller is not the land inspector"
        );
        _;
    }

    function getLandsCount() public view returns (uint) {
        return landsCount;
    }

    function getBuyersCount() public view returns (uint) {
        return buyersCount;
    }

    function getSellersCount() public view returns (uint) {
        return sellersCount;
    }

    function getRequestsCount() public view returns (uint) {
        return requestsCount;
    }
    function getArea(uint i) public view returns (string memory) {
        return lands[i].area;
    }
    function getCity(uint i) public view returns (string memory) {
        return lands[i].city;
    }
    function getDistrict(uint i) public view returns (string memory) {
        return lands[i].district;
    }
    function getPrice(uint i) public view returns (uint) {
        return lands[i].landPrice;
    }
    function getPID(uint i) public view returns (string memory) {
        return lands[i].propertyID;
    }

    function getLandOwner(uint id) public view returns (address) {
        return LandOwner[id];
    }

    function isSeller(address _id) public view returns (bool) {
        if (RegisteredSellerMapping[_id]) {
            return true;
        }
    }

    function isBuyer(address _id) public view returns (bool) {
        if (RegisteredBuyerMapping[_id]) {
            return true;
        }
    }
    function isRegistered(address _id) public view returns (bool) {
        if (RegisteredAddressMapping[_id]) {
            return true;
        }
    }

    function addLand(
        string memory _landAddress,
        string memory _area,
        string memory _city,
        string memory _district,
        string memory _country,
        uint _landPrice,
        string memory _propertyID
    ) public {
        require(isSeller(msg.sender), "Only sellers can add lands.");
        require(
            !propertyIDExists[_propertyID],
            "Property ID is already registered."
        );

        landsCount++;
        lands[landsCount] = Landreg(
            landsCount,
            _landAddress,
            _area,
            _city,
            _district,
            _country,
            _landPrice,
            _propertyID
        );
        landApprovalStatus[landsCount] = false; // Initially not approved
        LandOwner[landsCount] = msg.sender;
        propertyIDExists[_propertyID] = true; // Mark this property ID as registered

        RequestStatus[landsCount] = false;
        RequestedLands[landsCount] = false;
        saleApprovalStatus[landsCount] = false;

        // Emit an event that land has been added
        emit LandAdded(landsCount, msg.sender);
    }

    // Function for the land inspector to approve land
    function approveLand(uint _landId) public onlyLandInspector {
        require(!landApprovalStatus[_landId], "Land has already been approved");
        landApprovalStatus[_landId] = true;

        // Emit an event that land has been approved
        emit LandApproved(_landId);
    }

    function getLandDetails(
        uint _landId
    )
        public
        view
        returns (
            uint,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint,
            string memory
        )
    {
        require(
            _landId > 0 && _landId <= landsCount,
            "Land ID is out of bounds"
        );

        Landreg memory land = lands[_landId];
        return (
            land.id,
            land.landAddress,
            land.area,
            land.city,
            land.district,
            land.country,
            land.landPrice,
            land.propertyID
        );
    }

    //registration of seller
    function registerSeller(
        string memory _name,
        uint _age,
        string memory _HKID
    ) public {
        //require that Seller is not already registered
        require(!RegisteredAddressMapping[msg.sender]);

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredSellerMapping[msg.sender] = true;
        sellersCount++;
        SellerMapping[msg.sender] = Seller(msg.sender, _name, _age, _HKID);
        sellers.push(msg.sender);
        emit Registration(msg.sender);
    }

    function updateSeller(
        string memory _name,
        uint _age,
        string memory _HKID
    ) public {
        //require that Seller is already registered
        require(
            RegisteredAddressMapping[msg.sender] &&
                (SellerMapping[msg.sender].id == msg.sender)
        );

        SellerMapping[msg.sender].name = _name;
        SellerMapping[msg.sender].age = _age;
        SellerMapping[msg.sender].HKID = _HKID;
    }

    function getSeller() public view returns (address[] memory) {
        return (sellers);
    }

    function getSellerDetails(
        address i
    ) public view returns (string memory, uint, string memory) {
        return (
            SellerMapping[i].name,
            SellerMapping[i].age,
            SellerMapping[i].HKID
        );
    }

    function registerBuyer(
        string memory _name,
        uint _age,
        string memory _city,
        string memory _HKID,
        string memory _email
    ) public {
        //require that Buyer is not already registered
        require(!RegisteredAddressMapping[msg.sender]);

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredBuyerMapping[msg.sender] = true;
        buyersCount++;
        BuyerMapping[msg.sender] = Buyer(
            msg.sender,
            _name,
            _age,
            _city,
            _HKID,
            _email
        );
        buyers.push(msg.sender);

        emit Registration(msg.sender);
    }

    function updateBuyer(
        string memory _name,
        uint _age,
        string memory _city,
        string memory _email,
        string memory _HKID
    ) public {
        //require that Buyer is already registered
        require(
            RegisteredAddressMapping[msg.sender] &&
                (BuyerMapping[msg.sender].id == msg.sender)
        );

        BuyerMapping[msg.sender].name = _name;
        BuyerMapping[msg.sender].age = _age;
        BuyerMapping[msg.sender].city = _city;
        BuyerMapping[msg.sender].HKID = _HKID;
        BuyerMapping[msg.sender].email = _email;
    }

    function getBuyer() public view returns (address[] memory) {
        return (buyers);
    }

    function getBuyerDetails(
        address i
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint,
            string memory
        )
    {
        return (
            BuyerMapping[i].name,
            BuyerMapping[i].city,
            BuyerMapping[i].email,
            BuyerMapping[i].age,
            BuyerMapping[i].HKID
        );
    }

    function requestLand(address _sellerId, uint _landId) public {
        require(isBuyer(msg.sender));

        requestsCount++;
        RequestsMapping[requestsCount] = LandRequest(
            requestsCount,
            _sellerId,
            msg.sender,
            _landId
        );
        RequestStatus[requestsCount] = false;
        RequestedLands[requestsCount] = true;

        emit Landrequested(_sellerId);
    }

    // Function for the land inspector to approve the sale
    function approveSale(uint _reqId) public onlyLandInspector {
        require(
            RequestedLands[RequestsMapping[_reqId].landId],
            "Land has not been requested"
        );
        require(!saleApprovalStatus[_reqId], "Sale has already been approved");

        RequestStatus[_reqId] = true;
        saleApprovalStatus[_reqId] = true; // Mark sale as approved by the land inspector

        // Emit an event that sale has been approved
        emit SaleApproved(
            RequestsMapping[_reqId].landId,
            RequestsMapping[_reqId].sellerId,
            RequestsMapping[_reqId].buyerId
        );
    }

    function getRequestDetails(
        uint i
    ) public view returns (address, address, uint, bool) {
        return (
            RequestsMapping[i].sellerId,
            RequestsMapping[i].buyerId,
            RequestsMapping[i].landId,
            RequestStatus[i]
        );
    }

    function isLandApproved(uint _landId) public view returns (bool) {
        return landApprovalStatus[_landId];
    }

    function isSaleApproved(uint _reqId) public view returns (bool) {
        return saleApprovalStatus[_reqId];
    }

    function isRequested(uint _id) public view returns (bool) {
        if (RequestedLands[_id]) {
            return true;
        } else {
            return false;
        }
    }

    function isApproved(uint _id) public view returns (bool) {
        if (RequestStatus[_id]) {
            return true;
        } else {
            return false;
        }
    }

    function approveRequest(uint _reqId) public {
        require(isSeller(msg.sender));

        RequestStatus[_reqId] = true;
    }

    function isPaid(uint _landId) public view returns (bool) {
        if (PaymentReceived[_landId]) {
            return true;
        }
    }

    function payment(address payable _seller, uint _landId) public payable {
        require(LandOwner[_landId] == _seller, "Seller does not own the land");
        require(msg.value == lands[_landId].landPrice, "Incorrect payment amount");
        require(isBuyer(msg.sender), "Only registered buyers can make payments");
        require(landApprovalStatus[_landId], "Land has not been approved by the inspector");
        // Find the request ID associated with this land and buyer
        uint _reqId = findRequest(_seller, _landId, msg.sender);
        require(saleApprovalStatus[_reqId], "Sale has not beenapproved by the inspector");
        require(LandOwner[_landId] == _seller, "Seller does not own the land.");
        require(
            msg.value == lands[_landId].landPrice,
            "Incorrect payment amount."
        );
        require(
            isBuyer(msg.sender),
            "Only registered buyers can make payments."
        );

        // Transfer the land price to the seller
        _seller.transfer(msg.value);

        // Update the land ownership
        LandOwner[_landId] = msg.sender;

        // Mark the payment as received
        PaymentReceived[_landId] = true;

        // Emit an event that payment has been made
        emit PaymentMade(_landId, _seller, msg.sender);

        // Emit an event, if you have one for successful payment/transfer
        emit LandOwnershipTransferred(_landId, _seller, msg.sender);
    }

    // Helper function to find the request ID based on land and buyer
    function findRequest(address _seller, uint _landId, address _buyer) internal view returns (uint) {
        for (uint i = 1; i <= requestsCount; i++) {
            if (RequestsMapping[i].sellerId == _seller && RequestsMapping[i].buyerId == _buyer && RequestsMapping[i].landId == _landId) {
                return i;
            }
        }
        revert("Request not found");
    }
}
