//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CarNFTToken is ERC721Enumerable, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseURI;
    mapping(uint256 => string) private hashes;

    constructor() ERC721('Cars', 'CAR') {
        baseURI = "https://ipfs.io/ipfs/";
    }

    function mint(address _to, string[] memory _hashes) public onlyOwner {
        for (uint256 i = 0; i < _hashes.length; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _safeMint(_to, newItemId);
            hashes[newItemId] = _hashes[i];
        }
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory)
    {
        require(_exists(_tokenId), "Token with this Id does not exists");
        string memory currentBaseURI = _baseURI();

        return (bytes(currentBaseURI).length > 0 &&bytes(hashes[_tokenId]).length > 0)
                ? string(abi.encodePacked(currentBaseURI, hashes[_tokenId]))
                : "";
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
}

