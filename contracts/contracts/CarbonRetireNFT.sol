//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract CarbonRetireNFT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public tokenId;
    bool private _initialized;
    string private _baseURIextended;

    constructor(
        string memory baseURI_
    ) ERC721("CarbonRetireCert", "CRCERT") {
        address admin = msg.sender;
        require(admin != address(0), "admin=0");
        require(bytes(baseURI_).length > 0, "baseURI empty");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _baseURIextended = baseURI_;
        _initialized = true;
    }

    function mintCert(
        address to
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 id = ++tokenId;
        _safeMint(to, id);
        return id;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
