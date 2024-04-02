// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Collection is ERC721URIStorage, Ownable {

    uint256 private _tokenIds = 0;
    uint256 private _totalMinted = 0;
    mapping(address => uint8) private mintedAddress;    // { address => numberOfTokensMinted }
    mapping(string => uint8) private URIMapping;        // { URI => hasBeenCollected? }
    string[]  private tokenURIs;
    uint256 public PRICE_PER_TOKEN = 0.01 ether;

    uint256 public LIMIT_PER_ADDRESS = 5;
    uint256 public MAX_SUPPLY  = 5;

    constructor() ERC721("Collection", "NFT") Ownable(msg.sender) 
    {}

    function setPrice(uint256 price) external onlyOwner{
        PRICE_PER_TOKEN = price;
    }

    function setLimit(uint256 limit) external onlyOwner{
        LIMIT_PER_ADDRESS = limit;
    }

    function setMaxSupply(uint256 max_supply) external onlyOwner{
        MAX_SUPPLY = max_supply;
    }

    function addTokenURI( string memory _tokenURI ) external returns( uint )
    {
        tokenURIs.push(_tokenURI);
        return 100;
        // return( tokenURIs.length - 1 );
    }

    function mintNFT( string memory tokenURI, address owner )
        payable
        external
        returns (uint256)
    {
        require(PRICE_PER_TOKEN <= msg.value, "Ether paid is incorrect");
        require(mintedAddress[msg.sender] < LIMIT_PER_ADDRESS, "You have exceeded minting limit");
        require(_totalMinted + 1 <= MAX_SUPPLY, "You have exceeded Max Supply");
        require(URIMapping[tokenURI] == 0, "This NFT has already been minted");
        URIMapping[tokenURI] += 1;
        mintedAddress[msg.sender] += 1;

        uint256 newItemId = _tokenIds;
        _mint(owner, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds++;
        _totalMinted++;
        return newItemId;
    }

    function withdrawMoney() external onlyOwner{
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }

    function GetAvailableNFTs() external view returns ( string[] memory )
    {
        return tokenURIs;
    }

    function UpdateMetadata( ) external 
    {
        console.log( tokenURI(0) );
        string memory a = "QmVeyj7AhHdH6ewWNAcKPt6gToT7szENJhHujSBq8Y9bcW";
        _setTokenURI( 0, a );
        console.log( tokenURI(0) );
    }
}

contract Gallery is Ownable
{
    constructor() Ownable(msg.sender){}

    Collection[] public collections;
    mapping( string => uint ) private tok_collectionMap;   // TokenURI => collectionId
 
    uint currentCollectionId = 0;

    function AddNFT( string memory _collectionURI ) external returns ( uint )
    {
        Collection newCollection = new Collection();
        collections.push(newCollection);
        tok_collectionMap[_collectionURI] = currentCollectionId;
        newCollection.addTokenURI(_collectionURI);
        newCollection.transferOwnership(owner());
        if( collections.length >= 2 )
        {
            collections[0].UpdateMetadata();
        }
        currentCollectionId++; /////////////////////////////////
        return collections.length;

    }

    function GetAvailableNFTs() external view returns ( string[] memory )
    {
        uint totalLength = 0;
        for (uint i = 0; i < collections.length; i++) {
            totalLength += collections[i].GetAvailableNFTs().length;
        }

        string[] memory nfts = new string[](totalLength);
        uint currentIndex = 0;
        
        for (uint i = 0; i < collections.length; i++) {
            string[] memory uris = collections[i].GetAvailableNFTs();
            for (uint j = 0; j < uris.length; j++) {
                nfts[currentIndex] = uris[j];
                currentIndex++;
            }
        }
        return nfts;
        // collections[0].GetAvailableNFTs();
    }

    function mintNFT(string memory tokenURI) external payable
    {
        uint collectionID = tok_collectionMap[tokenURI];
        collections[collectionID].mintNFT{value:msg.value}(tokenURI, msg.sender);
    }

    function UpdateMetadata() public
    {
        
    }

}