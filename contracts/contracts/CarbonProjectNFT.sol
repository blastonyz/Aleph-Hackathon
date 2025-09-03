// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CarbonRetireNFT} from "./CarbonRetireNFT.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CarbonProjectNFT is ReentrancyGuard, ERC721, AccessControl {
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Payment token (GHC-like)
    IERC20 public paymentToken; // CarbonToken clone address

    // Retirement certificate contract to mint when burning
    CarbonRetireNFT public retireContract;

    string public _name;
    string public _symbol;

    // Project metadata
    uint256 public projectId; // e.g., 191
    address public issuer; // project owner
    address public treasury; // where funds go on purchase
    uint256 public price; // price in paymentToken per NFT (units aligned with token decimals)
    uint256 public maxSupply; // cap of NFTs for this project
    uint256 public mintedCount; // minted so far
    string private baseURI;

    // Flags
    bool public enforceNoResale; // if true, disallow transfers after minting
    bool private _initialized;

    // tokenId sequence
    uint256 public nextTokenId;

    // internal bypass for allowed internal transfers
    bool private _internalBypass;

    event Purchased(
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 retireCertId
    );
    event Retired(
        address indexed account,
        uint256 indexed tokenId,
        uint256 retireCertId
    );
    event TransferTrace(
        uint256 indexed projectId,
        uint256 indexed tokenId,
        address indexed from,
        address to
    );

    constructor() ERC721("CarbonProject", "CPNFT") {
        // implementation constructor - clones will call initialize
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        uint256 _projectId,
        address admin,
        address _paymentToken,
        address _retireContract,
        address _treasury,
        uint256 _price,
        uint256 _maxSupply,
        bool _enforceNoResale,
        string calldata baseURI_,
        address minter_
    ) external {
        require(!_initialized, "already initialized");
        require(admin != address(0), "admin=0");
        require(_paymentToken != address(0), "paymentToken=0");
        require(_treasury != address(0), "treasury=0");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, minter_);

        _name = name_;
        _symbol = symbol_;

        projectId = _projectId;
        issuer = admin;
        paymentToken = IERC20(_paymentToken);
        retireContract = CarbonRetireNFT(_retireContract);
        treasury = _treasury;
        price = _price;
        maxSupply = _maxSupply;
        enforceNoResale = _enforceNoResale;
        _initialized = true;
        baseURI = baseURI_;
    }

    // internal baseURI helper using ERC721URIStorage's _setTokenURI per token; we will use tokenURIs per token
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }


    function tokenURI(uint256) public view override returns (string memory) {
        return baseURI;
    }


    function getBaseURI() external view returns (string memory) {
    return baseURI;
    }


    function buy() external nonReentrant returns (uint256) {
        require(_initialized, "not init");
        require(mintedCount < maxSupply, "sold out");
        require(price > 0, "free? use mint role");
        address buyer = msg.sender;
        // transfer payment from buyer to treasury
        require(
            paymentToken.transferFrom(buyer, treasury, price),
            "payment failed"
        );

        // mint NFT to buyer
        uint256 tid = ++nextTokenId;
        mintedCount += 1;
        _internalBypass = true;
        _safeMint(buyer, tid);
        _internalBypass = false;

        emit Purchased(buyer, tid, price);
        return tid;
    }

    function adminMint(
        address to
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(mintedCount < maxSupply, "maxSupply");
        uint256 tid = ++nextTokenId;
        mintedCount += 1;
        _safeMint(to, tid);
        return tid;
    }

    function adminMintBatch(uint256 amount) external onlyRole(MINTER_ROLE) {
        require(mintedCount + amount < maxSupply, "cap exceded");
        for (uint256 i = 0; i < amount; ++i) {
            uint256 tid = ++nextTokenId;
            mintedCount += 1;
            _safeMint(msg.sender, tid);
            emit Purchased(msg.sender, tid, 0); // price = 0 for admin mint;
        }
    }

    // Burn token to retire: holder burns their token and receives retirement certificate
    function retire(uint256 tokenId) external returns (uint256) {
        require(ownerOf(tokenId) == msg.sender, "not owner");
        // burn
        _burn(tokenId);
        // mint retire cert
        uint256 certId = retireContract.mintCert(msg.sender);
        emit Retired(msg.sender, tokenId, certId);
        return certId;
    }

    // Override transfer protections: if enforceNoResale, block transfers between users
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721) {
        if (!_internalBypass && enforceNoResale && from != address(0)) {
            revert("Transfers disabled for this project");
        }

        super.transferFrom(from, to, tokenId);
        emit TransferTrace(projectId, tokenId, from, to);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
