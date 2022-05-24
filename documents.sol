
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract DocumentRegistry {
    mapping(string => uint256) documents;
    address contractOwner = msg.sender;

    function addDocument(string memory hash) public returns(uint256 timeStamp) {
        require(contractOwner == address(this) , "Not a owner to store document");
        documents[hash] = block.timestamp;
        return block.timestamp;
    }

    function verifyDocument(string memory hash) public view returns(uint256 dateAdded){
        dateAdded = documents[hash];
        return dateAdded;
    }
}