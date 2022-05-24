const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("CARNFTToken", function () {

  let CARNFTToken;
  let carNFTToken;

  beforeEach(async function () {
    CARNFTToken = await ethers.getContractFactory("CarNFTToken");
    [owner, address1, address2, address3] = await ethers.getSigners();
    carNFTToken = await CARNFTToken.deploy();
  });


  describe("BaseURI", function () {

    it("only owner can set baseURI", async function () {
      //reverted because address1 is not the owner
      await expect(carNFTToken.connect(address1).setBaseURI('http://google.es')).to.be.revertedWith('Ownable: caller is not the owner');

    });

    it("behaviour", async function () {

      await expect(carNFTToken.connect(owner).setBaseURI('http://google.es'));
      expect(await carNFTToken.connect(owner).baseURI()).to.equal('http://google.es');
    });
  });

  describe("Mint", function () {

    it("only owner can mint", async function () {
      //reverted because address1 is not the owner
      await expect(carNFTToken.connect(address1).mint(address1.address, ['abc', 'def'])).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("behaviour", async function () {

      await expect(carNFTToken.connect(owner).mint(address1.address, ["aa", "bb"]));
      expect(await carNFTToken.totalSupply()).to.equal(2);
      var baseURI = await carNFTToken.connect(address1).baseURI();


      expect(await carNFTToken.connect(address1).tokenURI(1)).to.equal(baseURI + 'aa');
      expect(await carNFTToken.connect(address1).tokenURI(2)).to.equal(baseURI + 'bb');
    });
  });
});
