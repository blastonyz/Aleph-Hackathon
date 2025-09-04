// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";


contract GHToken is ERC20, AccessControl{
    bytes32 private MINTER_ROLE = keccak256("MINTER_ROLE");

    bool private initialized;
    address private admin;

    event TokenMinted(address indexed to, uint256 amount, string context);

    constructor() ERC20("GH COIN","GHC"){
        admin = msg.sender;
        require(admin != address(0), "admin=0");
        initialized = true;
        _grantRole(DEFAULT_ADMIN_ROLE,admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE){
        _mint(to, amount);
        emit TokenMinted(to,amount,"token granteds");
    }

    function burn(uint256 amount) external {
        _burn(msg.sender,amount);
    }
}