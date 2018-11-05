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

    function createStar(string _name, string _dec, string _mag, string _cent, string _story, uint256 _tokenId) public {

        bytes32 hashedCoordinates = keccak256(
            abi.encodePacked(_dec, _mag, _cent));
        require(coordinatesToTokenId[hashedCoordinates] == 0x0);

        Star memory newStar = Star(_name, _dec, _mag, _cent, _story);

        tokenIdToStarInfo[_tokenId] = newStar;
        coordinatesToTokenId[hashedCoordinates] = _tokenId;

        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(uint256 tokenId) public view returns (bool) {
        Star star = tokenIdToStarInfo[tokenId];
        bytes32 hashedCoordinates = keccak256(
            abi.encodePacked(star.dec, star.mag, star.cent));

        return coordinatesToTokenId[hashedCoordinates] != 0x0;
    }
}
