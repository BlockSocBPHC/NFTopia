// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

struct Token {
    uint256 id;
    string uri;
}

contract Collection is ERC721URIStorage, Ownable {

    uint256 private nextTokenID = 0;
    uint256 private totalMinted = 0;
    // mapping(address => uint8) private mintedAddress;    // { address => numberOfTokensMinted }
    // mapping(string => uint8) private URIMapping;        // { URI => hasBeenCollected? }
    // string[]  private tokenURIs;
    uint256 public PRICE_PER_TOKEN = 0.01 ether;

    uint256 public LIMIT_PER_ADDRESS = 5;
    uint256 public MAX_SUPPLY  = 5;

    ////////////////// 
    mapping( address => Token[] ) private tokensByOwner;


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

    function AddToken( string memory _tokenURI ) external returns( uint )
    {
        Token memory newToken = Token(nextTokenID, _tokenURI);
        tokensByOwner[address(0)].push(newToken);
        return( nextTokenID++ );
    }

    function FindTokenWithID( uint tokenID, address owner ) internal view returns(Token memory)
    {
        Token[] memory tokens = tokensByOwner[owner];
        for( uint i = 0; i < tokens.length; i++ )
        {
            if( tokens[i].id == tokenID )
            return (tokens[i]);
        }
        return Token(0, "");
    }

    function mintNFT( uint256 tokenID, address owner )       // Use tokenID instead of tokenURIs 
        payable
        external
        returns (uint256)
    {
        require(PRICE_PER_TOKEN <= msg.value, "Ether paid is incorrect");
        require( tokensByOwner[owner].length < LIMIT_PER_ADDRESS, "You have exceeded the minting limit for this account");
        require(totalMinted + 1 <= MAX_SUPPLY, "You have exceeded Max Supply");
        // require(URIMapping[tokenURI] == 0, "This NFT has already been minted");
        // URIMapping[tokenURI] += 1;
        // mintedAddress[msg.sender] += 1;

        // uint256 newItemId = _tokenIds;
        Token memory token = FindTokenWithID(tokenID, address(0));
        _mint(owner, token.id);
        _setTokenURI(token.id, token.uri);

        totalMinted++;
        return token.id;
    }

    function withdrawMoney() external onlyOwner{
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }

    function GetAvailableNFTs() external view returns ( Token[] memory )
    {
        return tokensByOwner[address(0)];
    }

    // function UpdateMetadata( ) external 
    // {
    //     console.log( tokenURI(0) );
    //     string memory a = "QmVeyj7AhHdH6ewWNAcKPt6gToT7szENJhHujSBq8Y9bcW";
    //     _setTokenURI( 0, a );
    //     console.log( tokenURI(0) );
    // }
}

contract Gallery is Ownable
{
    constructor() Ownable(msg.sender){}

    Collection[] public collections;
    // mapping( string => uint ) private tok_collectionMap;   // TokenURI => collectionId
    
    uint currentCollectionId = 0;

    function AddNFTs( string memory _collectionURIs ) external returns ( uint )       //Add functionaity for multiple images in a single upload
    {
        Collection newCollection = new Collection();
        collections.push(newCollection);
        // for ( uint i = 0; i < _collectionURIs.length; i++)
        // {
        // tok_collectionMap[_collectionURIs] = currentCollectionId;            ////////////////////////////
        newCollection.AddToken(_collectionURIs);
        newCollection.transferOwnership(owner());
        // }
        currentCollectionId++; /////////////////////////////////
        return collections.length;

    }

    function GetAvailableNFTs() external view returns ( Token[] memory )
    {
        uint totalLength = 0;
        for (uint i = 0; i < collections.length; i++) {
            totalLength += collections[i].GetAvailableNFTs().length;
        }

        Token[] memory nfts = new Token[](totalLength);
        uint currentIndex = 0;
        
        for (uint i = 0; i < collections.length; i++) {
            Token[] memory uris = collections[i].GetAvailableNFTs();
            for (uint j = 0; j < uris.length; j++) {
                nfts[currentIndex] = uris[j];
                currentIndex++;
            }
        }
        return nfts;
    }

    function mintNFT( uint collectionID, uint tokenID) external payable           // Change to collectionID and tokenID format
    {
        // uint collectionID = tok_collectionMap[tokenURI];
        collections[collectionID].mintNFT{value:msg.value}(tokenID, msg.sender);
    }

}