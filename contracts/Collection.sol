// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

struct Token {
    uint256 id;
    uint256 collectionId;
    string uri;
    string[] voters;
    // string artist_name;
}

contract Collection is ERC721URIStorage, Ownable {
    address public artist;
    uint256 private id;
    uint256 private nextTokenID = 0;
    uint256 private totalMinted = 0;
    uint256 public PRICE_PER_TOKEN = 0.01 ether;
    Token[] private allTokens;

    constructor( uint256 newId, address _artist) ERC721("Collection", "NFT") Ownable(msg.sender) 
    {
        id = newId;
        artist = _artist;
    }

    function AddToken( string memory _tokenURI ) external returns( uint )
    {
        Token memory temp = Token(nextTokenID, id, _tokenURI, new string[](0)  );
        allTokens.push(temp);
        return( nextTokenID++ );
    }

    function FindTokenWithID( uint tokenID ) internal view returns(Token memory)
    {
        for( uint i = 0; i < allTokens.length; i++ )
        {
            if( allTokens[i].id == tokenID )
            return (allTokens[i]);
        }
        return Token(0, 0, "", new string[](0));
    }

    function AddVote( uint tokenID, string memory voterName ) external
    {
        for( uint i = 0; i < allTokens.length; i++ )
        {
            if( allTokens[i].id == tokenID )
                allTokens[i].voters.push(voterName);
        }
    }

    function DeleteVote( uint tokenId, string memory voterName ) external
    {
        uint flag = 0;
        for( uint i = 0; i < allTokens.length; i++ )
        {
            if( allTokens[i].id == tokenId )
            {
                for( uint j = 0; j < allTokens[i].voters.length; j++)
                {
                    if( ( keccak256(abi.encode(allTokens[i].voters[j])) == keccak256(abi.encode(voterName)) ) && flag == 0 )
                    {
                        allTokens[i].voters = remove(j , allTokens[i].voters);
                        flag = 1;
                    }
                }
            }
        }
    }
 

    function remove(uint index, string[] memory array) internal pure returns(string[] memory){
        require (index < array.length);
        string[] memory newArray;
        for( uint i = 0; i < array.length; i++)
        {
            if( i < index )
            {
                newArray[i] = array[i];
            }
            else if( i > index )
            {
                newArray[i-1] = array[i];
            }
        }
        return newArray;
    }

    function mintNFT( uint256 tokenID, address owner )
        payable
        external
        returns (uint256)
    {
        require(PRICE_PER_TOKEN <= msg.value, "Ether paid is incorrect");
        Token memory token = FindTokenWithID(tokenID);
        _mint(owner, token.id);
        _setTokenURI(token.id, token.uri);

        totalMinted++;
        return token.id;
    }

    function GetAvailableNFTs() external view returns ( Token[] memory )
    {
        return allTokens;
    }

    function GetAllNFTs() external view returns( Token[] memory )
    {
        return allTokens;
    }
}

contract Gallery is Ownable
{

    struct Voter
    {
        uint tokenId;
        uint collectionId;
        address voterAddress;
        string name;
    }

    constructor() Ownable(msg.sender){}

    Collection[] public collections;   
    Voter[] public voters; 
    uint256 currentCollectionId = 0;

    function AddVote( uint collectionId, uint tokenId, string memory voterName) external 
    {
        Voter memory voter = Voter( tokenId, collectionId, msg.sender, voterName);
        for( uint i = 0; i < voters.length; i++)
        {
            if( voters[i].voterAddress == msg.sender )
            {
                collections[voters[i].collectionId].DeleteVote(tokenId,voters[i].name);
                collections[collectionId].AddVote(tokenId, voterName);
                voters[i] = voter;
                return;
            }
        }
        collections[collectionId].AddVote(tokenId, voterName);
        voters.push(voter);
    }

    function GetAllNFTs( address seller ) external view returns( Token[] memory )
    {
         uint totalLength = 0;
        for (uint i = 0; i < collections.length; i++) {
            if( collections[i].artist() == seller )
            {
                totalLength += collections[i].GetAllNFTs().length;
            }
        }

        Token[] memory nfts = new Token[](totalLength);
        uint currentIndex = 0;
        
        for (uint i = 0; i < collections.length; i++) {
            if( collections[i].artist() == seller )
            {
                Token[] memory uris = collections[i].GetAllNFTs();
                for (uint j = 0; j < uris.length; j++) {
                    nfts[currentIndex] = uris[j];
                    currentIndex++;
                }
            }
        }
        return nfts;
    }

    function AddNFTs( string memory _collectionURIs ) external returns ( uint ) 
    {
        Collection newCollection = new Collection(currentCollectionId, msg.sender );
        collections.push(newCollection);
        newCollection.AddToken(_collectionURIs);
        newCollection.transferOwnership(owner());
        currentCollectionId++;
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

    function mintNFT( uint collectionID, uint tokenID) external payable 
    {
        collections[collectionID].mintNFT{value:msg.value}(tokenID, msg.sender);
    }

}