// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {CarbonProjectNFT} from "./CarbonProjectNFT.sol";

contract CarbonFactory is AccessControl{
    using Clones for address;

    address public projectImplementation;
    address public retireImplementation;
    address public tokenImplementation;

    struct ProjectRecord{
        address projectClone;
        uint256 projectId;
        address owner;
        address treasury;
        uint256 price;
        uint256 maxSupply;
        string metadataURI;
    }

    ProjectRecord[] public projects;

    mapping(address => uint256[]) public byOwner;

    event ProjectDeployed(address indexed owner, address indexed clone, uint256 projectId, address minter);

    constructor(address admin_, address _projectImpl, address _retireImpl, address _tokenImpl) {
        require(admin_ != address(0), "admin=0");
        projectImplementation = _projectImpl;
        retireImplementation = _retireImpl;
        tokenImplementation = _tokenImpl;
    }

    // deploy retire implementation (singleton) via clone or use existing
    function createProjectClone(
        string calldata name_,
        string calldata symbol_,
        uint256 projectId,
        address owner_,
        address paymentToken,
        address retireContract,
        address treasury,
        uint256 price,
        uint256 maxSupply,
        bool enforceNoResale,
        string calldata metadataURI
    ) external  returns (address clone) {
        clone = Clones.clone(projectImplementation);
        CarbonProjectNFT(clone).initialize(
            name_,
            symbol_,
            projectId,
            owner_,
            paymentToken,
            retireContract,
            treasury,
            price,
            maxSupply,
            enforceNoResale,
            metadataURI,
            msg.sender // minter
        );

        projects.push(ProjectRecord({
            projectClone: clone,
            projectId: projectId,
            owner: owner_,
            treasury: treasury,
            price: price,
            maxSupply: maxSupply,
            metadataURI: metadataURI
        }));
        byOwner[owner_].push(projects.length - 1);
        emit ProjectDeployed(owner_, clone, projectId, msg.sender);
    }

    function totalProjects() external view returns (uint256) { return projects.length; }

    function getOwnerProjects(address owner_) external view returns (ProjectRecord[] memory list) {
        uint256[] storage idxs = byOwner[owner_];
        list = new ProjectRecord[](idxs.length);
        for (uint256 i = 0; i < idxs.length; ++i) {
            list[i] = projects[idxs[i]];
        }
    }
    
}