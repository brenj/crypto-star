pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
        string dec;
        string mag;
        string cent;
        string story;
    }

    mapping(bytes32 => uint256) public coordinatesToTokenId;
    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(
        string name,
        string dec,
        string mag,
        string cent,
        string story,
        uint256 tokenId
    )
        public
    {
        bytes32 hashedCoordinates = keccak256(
            abi.encodePacked(dec, mag, cent));
        require(coordinatesToTokenId[hashedCoordinates] == 0x0);

        Star memory newStar = Star(name, dec, mag, cent, story);

        tokenIdToStarInfo[tokenId] = newStar;
        coordinatesToTokenId[hashedCoordinates] = tokenId;

        mint(tokenId);
    }

    function putStarUpForSale(uint256 tokenId, uint256 price) public {
        require(this.ownerOf(tokenId) == msg.sender);

        starsForSale[tokenId] = price;
    }

    function buyStar(uint256 tokenId) public payable {
        require(starsForSale[tokenId] > 0);
        
        uint256 starCost = starsForSale[tokenId];
        address starOwner = this.ownerOf(tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, tokenId);
        _addTokenTo(msg.sender, tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(uint256 tokenId) public view returns (bool) {
        Star memory star = tokenIdToStarInfo[tokenId];
        bytes32 hashedCoordinates = keccak256(
            abi.encodePacked(star.dec, star.mag, star.cent));

        return coordinatesToTokenId[hashedCoordinates] != 0x0;
    }

    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return ERC721.ownerOf(tokenId);
    }

    function approve(uint256 tokenId) public {
        ERC721.approve(msg.sender, tokenId);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        return ERC721.getApproved(tokenId);
    }

    function setApprovalForAll(address to, bool approved) public {
        ERC721.setApprovalForAll(to, approved);
    }

    function isApprovedForAll(
        address owner,
        address operator
    )
        public
        view
        returns (bool)
    {
        return ERC721.isApprovedForAll(owner, operator);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    )
        public
    {
        ERC721.safeTransferFrom(from, to, tokenId);
    }
}
