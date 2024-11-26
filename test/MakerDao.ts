import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers, web3 } from "hardhat";
import { AddressLike, BytesLike, encodeBytes32String } from "ethers";

describe("Modules", async function () {
  const deployDAI = async () => {
    const [owner, account1] = await hre.ethers.getSigners();
    const DAI = await hre.ethers.getContractFactory("Dai");
    const dai = await DAI.deploy(1);
    return { dai, owner, account1 };
  };
  const deployVat = async () => {
    const [owner, account1] = await hre.ethers.getSigners();
    const VAT = await hre.ethers.getContractFactory("Vat");
    const vat = await VAT.deploy();
    return { vat, owner, account1 };
  };
  const deployDAIJoin = async (vat_: AddressLike, dai: AddressLike) => {
    const [owner, account1] = await hre.ethers.getSigners();
    const DAIJoin = await hre.ethers.getContractFactory("DaiJoin");
    const daiJoin = await DAIJoin.deploy(vat_, dai);
    return { daiJoin, owner, account1 };
  };
  const deployETHJoin = async (vat_: AddressLike, ilk: BytesLike) => {
    const [owner, account1] = await hre.ethers.getSigners();
    const ETHJoin = await hre.ethers.getContractFactory("ETHJoin");
    const ethJoin = await ETHJoin.deploy(vat_, ilk);
    return { ethJoin, owner, account1 };
  };
  const deploySpotter = async (vat_: AddressLike) => {
    const [owner, account1] = await hre.ethers.getSigners();
    const SPOTTER = await hre.ethers.getContractFactory("Spotter");
    const spotter = await SPOTTER.deploy(vat_);
    return { spotter, owner, account1 };
  };
  const deployMedian = async () => {
    const Median = await hre.ethers.getContractFactory("Median");
    const median = await Median.deploy();
    return { median };
  };
  const deployOSM = async (src: AddressLike) => {
    const [owner, account1] = await hre.ethers.getSigners();
    const OSM = await hre.ethers.getContractFactory("OSM");
    const osm = await OSM.deploy(src);
    return { osm, owner, account1 };
  };

  describe("Deployment", function () {
    it("Should DAI set the owner as authorized address", async function () {
      const { dai, owner } = await loadFixture(deployDAI);
      expect(await dai.wards(owner.address)).to.equal(1);
    });
    it("Should Vat set the owner as authorized address", async function () {
      const { vat, owner } = await loadFixture(deployVat);
      expect(await vat.wards(owner.address)).to.equal(1);
    });
    it("Should deploy DaiJoin with correct arguments", async function () {
      const { vat } = await loadFixture(deployVat);
      const { dai } = await loadFixture(deployDAI);
      const { daiJoin } = await deployDAIJoin(vat, dai);
      expect(await daiJoin.vat()).to.equal(await vat.getAddress());
      expect(await daiJoin.dai()).to.equal(await dai.getAddress());
    });
    it("Should deploy Median", async function () {
      const { median } = await deployMedian();
      expect(median);
    });
    it("Should deploy OSM with correct arguments", async function () {
      const { median } = await deployMedian();
      const { osm } = await deployOSM(await median.getAddress());
      expect(await osm.src()).to.equal(await median.getAddress());
    });
    it("Should deploy ETHJoin with correct arguments", async function () {
      const { vat } = await loadFixture(deployVat);
      const { ethJoin } = await deployETHJoin(
        vat,
        encodeBytes32String("ETHDAI")
      );
      expect(await ethJoin.ilk()).to.equal(encodeBytes32String("ETHDAI"));
      expect(await ethJoin.vat()).to.equal(await vat.getAddress());
    });
    it("Should deploy Spotter with correct arguments", async function () {
      const { vat } = await loadFixture(deployVat);
      const { spotter } = await deploySpotter(vat);
      expect(await spotter.vat()).to.equal(await vat.getAddress());
    });
  });

  describe("Maker Dao Protocol", function () {
    it("Recover Valid Address", async function () {
      const [owner, account1] = await hre.ethers.getSigners();
      const { median } = await deployMedian();

      const MessageVerifier = await hre.ethers.getContractFactory(
        "MessageVerifier"
      );
      const messageVerifier = await MessageVerifier.deploy();
      // const hashedMessage = await ethers.hashMessage("Hello")
      const signature = await owner.signMessage("hello");
      const recove = await ethers.recoverAddress(
        ethers.hashMessage("hello"),
        signature
      ); // => owner address
      const isValid = await messageVerifier.verifySignature("hello", signature);
      // console.log('Is valid signature:', isValid, owner.address);
      // console.log(await messageVerifier.getMessageHash("hello") , ethers.hashMessage("hello"))
      // console.log(await median.messageHash())
      // they are not match so doent return valid recover address
      // todo : I commented the cryptographic part in median becuas i couldnt make the valid singture by etherjs but try web3

      // // Example data
      // const val_ = web3.utils.toWei("1000", "ether"); // 1000 ETH
      // const age_ = Math.floor(Date.now() / 1000); // Current timestamp
      // const wat = "ethusd"; // Example string data

      // const packedData = hre.ethers.solidityPacked(
      //   ["uint256", "uint256", "string"],
      //   [val_, age_, wat]
      // );
      // const hashedPackedData = hre.ethers.keccak256(packedData);
      // const prefixedHash = ethers.keccak256(
      //   hre.ethers.solidityPacked(
      //     ["string", "bytes32"],
      //     ["\x19Ethereum Signed Message:\n32", hashedPackedData]
      //   )
      // );

      // const message = "Your Message Here"; // The message to be signed
      // const prefixedMessage = "\x19Ethereum Signed Message:\n" + message.length + message;

      // // Sign the prefixed message
      // const signature = await owner.signMessage(prefixedMessage);

      // // Extract r, s, v from the signature
      // const sig = signature.startsWith("0x") ? signature.slice(2) : signature;
      // const r = "0x" + sig.slice(0, 64); // First 32 bytes
      // const s = "0x" + sig.slice(64, 128); // Next 32 bytes
      // const v = parseInt(sig.slice(128, 130), 16); // Final byte

      // // Call the contract's myrecover function
      // const recoveredAddress = await median.myrecover(v, r, s);

      // console.log(ethers.recoverAddress(prefixedMessage, signature))

      // // Check if the recovered address matches the signer's address
      // console.log("Recovered address:", recoveredAddress);
      // console.log("Matches owner:", recoveredAddress === owner.address);
      // console.log("owner address" , owner.address);

      // const messageHash = hre.ethers.keccak256(val_ + age_ + wat);
      // const signature = await owner.signMessage(messageHash);

      // const r = "0x" + signature.slice(2, 66); // First 32 bytes
      // const s = "0x" + signature.slice(66, 130); // Second 32 bytes
      // const v = parseInt(signature.slice(130, 132), 16); // Recovery id (last byte)

      // // Adjust v to be 27 or 28 as expected by Solidity
      // const vFixed = v < 27 ? v + 27 : v;
      // const recoveredAddress = await median.recover(val_, age_, vFixed, r, s);
      // console.log(recoveredAddress, owner.address);
    });
    it("Borrow DAI With Ethereum", async function () {
      const ilk = encodeBytes32String("ETH-A");
      const { dai, owner, account1 } = await loadFixture(deployDAI);
      const { vat } = await deployVat();
      const { daiJoin } = await deployDAIJoin(vat, dai);
      const { median } = await deployMedian();
      const { osm } = await deployOSM(median);
      const { ethJoin } = await deployETHJoin(vat, ilk);
      const { spotter } = await deploySpotter(vat);

      const ethJoinAddress = await ethJoin.getAddress();
      const daiJoinAddress = await daiJoin.getAddress();
      const vatAddress = await vat.getAddress();
      const medianAddress = await median.getAddress();
      const osmAddress = await osm.getAddress();
      const spotterAddress = await spotter.getAddress();

      spotter["file(bytes32,bytes32,address)"](
        ilk,
        encodeBytes32String("pip"),
        osmAddress
      ); // set osm for ETH-A]
      spotter["file(bytes32,bytes32,uint256)"](
        ilk,
        encodeBytes32String("mat"),
        "1500000000000000000000000000"
      ); // 150% collateral ratio

      // Add whitelist address to Median
      await median["kiss(address)"](osmAddress); // let the osm fetch the price from median
      await median["kiss(address)"](owner.address); // let the owner fetch the price from median
      await osm["kiss(address)"](spotterAddress); // let the spotter fetch the price from osm
      await osm["kiss(address)"](owner.address); // let the owner addrest peek the price
      await dai.connect(owner).rely(daiJoinAddress); // let the daiJoin mint dai
      await vat.connect(owner).rely(ethJoinAddress); // let the ethJoin update the user's balance
      await vat.connect(owner).rely(spotterAddress); // let the spotter update the illk.spot
      await vat.connect(owner).init(ilk);

      // Add the oracle to median
      await median.lift([owner.address]);

      // Initial Median Price Update
      const initialPrice = ethers.parseEther("3000");
      const age1 = (await ethers.provider.getBlock("latest"))?.timestamp; // Current timestamp
      await median.poke([initialPrice], [age1], [owner.address]);
      console.log(await median.peek(), "Initial Median Price");
      await osm.poke();
      console.log(await osm.peek(), "Initial OSM Price");
      // Simulate time passage of 1 hour
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour
      await ethers.provider.send("evm_mine");
      // Second Median Price Update
      const updatedPrice = ethers.parseEther("3000"); // New price
      const age2 = (await ethers.provider.getBlock("latest"))?.timestamp; // Updated timestamp after 1 hour
      await median.poke([updatedPrice], [age2], [owner.address]);

      console.log(await median.peek(), "Updated Median Price");
      await osm.poke();
      console.log(await osm.peek(), "Updated OSM Price");

      await spotter.poke(ilk);
      console.log((await vat.ilks(ilk)).spot);

      const collateralAmount = ethers.parseEther("10");
      await ethJoin
        .connect(account1)
        .join(account1.address, { value: collateralAmount });

      // Adjust debt and collateral (borrow Dai)
      await vat.connect(account1).frob(
        ilk,
        account1.address,
        account1.address,
        account1.address,
        collateralAmount,
        ethers.parseEther("20000") // the Max Dai
      );

      await vat.connect(account1).hope(daiJoinAddress); // account lets the daiJoin have accesee to my balance in vat

      // Convert the borrowed Dai to real Dai tokens using daiJoin
      await daiJoin
        .connect(account1)
        .exit(account1.address, ethers.parseEther("20000"));

      console.log(await vat.urns(ilk, account1.address));
      console.log(await dai.balanceOf(account1.address));
    });
  });
});

