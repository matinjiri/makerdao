import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers, web3 } from "hardhat";
import { AddressLike, BytesLike, encodeBytes32String } from "ethers";
import {
  Clipper,
  Dai,
  DaiJoin,
  Dog,
  ETHJoin,
  LinearDecrease,
  Median,
  OSM,
  Spotter,
  Vat,
  Vow,
} from "../typechain-types";
import * as helper from "../heplers/deployHelper";

describe("Modules", async function () {
  let dai: Dai,
    vat: Vat,
    daiJoin: DaiJoin,
    ethJoin: ETHJoin,
    spotter: Spotter,
    median: Median,
    osm: OSM,
    dog: Dog,
    vow: Vow,
    clip: Clipper,
    abaci: LinearDecrease;
  const ilk = encodeBytes32String("ETH-A");
  let ethJoinAddress: AddressLike,
    daiJoinAddress: AddressLike,
    vatAddress: AddressLike,
    medianAddress: AddressLike,
    osmAddress: AddressLike,
    spotterAddress: AddressLike,
    vowAddress: AddressLike,
    clipAddress: AddressLike,
    dogAddress: AddressLike,
    abaciAddress: AddressLike;
  beforeEach(async function () {
    ({ dai } = await loadFixture(helper.deployDAI));
    ({ vat } = await helper.deployVat());
    ({ daiJoin } = await helper.deployDAIJoin(vat, dai));
    ({ median } = await helper.deployMedian());
    ({ osm } = await helper.deployOSM(await median.getAddress()));
    ({ ethJoin } = await helper.deployETHJoin(vat, ilk));
    ({ spotter } = await helper.deploySpotter(vat));
    ({ dog } = await helper.deployDog(vat));
    ({ vow } = await helper.deployVow(vat));
    ({ clip } = await helper.deployClip(vat, spotter, dog, ilk));
    ({ abaci } = await helper.deployAbaci());
    ethJoinAddress = await ethJoin.getAddress();
    daiJoinAddress = await daiJoin.getAddress();
    vatAddress = await vat.getAddress();
    medianAddress = await median.getAddress();
    osmAddress = await osm.getAddress();
    spotterAddress = await spotter.getAddress();
    vowAddress = await vow.getAddress();
    clipAddress = await clip.getAddress();
    dogAddress = await dog.getAddress();
    abaciAddress = await abaci.getAddress();
  });
  describe("Deployment", function () {
    it("Should DAI set the owner as authorized address", async function () {
      expect(dai).to.exist;
    });
    it("Should Vat set the owner as authorized address", async function () {
      expect(vat).to.exist;
    });
    it("Should deploy DaiJoin with correct arguments", async function () {
      expect(daiJoin).to.exist;
    });
    it("Should deploy Median", async function () {
      expect(median).to.exist;
    });
    it("Should deploy OSM with correct arguments", async function () {
      expect(osm).to.exist;
    });
    it("Should deploy ETHJoin with correct arguments", async function () {
      expect(ethJoin).to.exist;
    });
    it("Should deploy Spotter with correct arguments", async function () {
      expect(spotter).to.exist;
    });
    it("Should deploy Abacus", async function () {
      expect(abaci).to.exist;
    });
  });

  describe("Maker Dao Protocol", function () {
    it("Borrow DAI With Ethereum", async function () {
      const [owner, account1] = await hre.ethers.getSigners();

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
    it("Bark The Undercollaterized Vault", async function () {
      const [owner, account1] = await hre.ethers.getSigners();
      spotter["file(bytes32,bytes32,address)"](
        ilk,
        encodeBytes32String("pip"),
        osmAddress
      );
      spotter["file(bytes32,bytes32,uint256)"](
        ilk,
        encodeBytes32String("mat"),
        "1500000000000000000000000000"
      );
      await median["kiss(address)"](osmAddress); // let the osm fetch the price from median
      await median["kiss(address)"](owner.address); // let the owner fetch the price from median
      await osm["kiss(address)"](spotterAddress); // let the spotter fetch the price from osm
      await osm["kiss(address)"](clipAddress); // let the clip fetch the price from osm
      await osm["kiss(address)"](owner.address); // let the owner addrest peek the price
      await dai.connect(owner).rely(daiJoinAddress); // let the daiJoin mint dai
      await vat.connect(owner).rely(ethJoinAddress); // let the ethJoin update the user's balance
      await vat.connect(owner).rely(spotterAddress); // let the spotter update the illk.spot
      await vat.connect(owner).rely(dogAddress);
      await vat.connect(owner).init(ilk);
      await median.lift([owner.address]);
      await clip.connect(owner).rely(dogAddress); // let the dog call kik
      const initialPrice = ethers.parseEther("3000");
      const age1 = (await ethers.provider.getBlock("latest"))?.timestamp; // Current timestamp
      await median.poke([initialPrice], [age1], [owner.address]);
      await osm.poke();
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour
      await ethers.provider.send("evm_mine");
      const updatedPrice = ethers.parseEther("2900"); // New price
      const age2 = (await ethers.provider.getBlock("latest"))?.timestamp; // Updated timestamp after 1 hour
      await median.poke([updatedPrice], [age2], [owner.address]);
      await osm.poke();
      await spotter.poke(ilk);
      const collateralAmount = ethers.parseEther("10");
      await ethJoin
        .connect(account1)
        .join(account1.address, { value: collateralAmount });
      await vat.connect(account1).frob(
        ilk,
        account1.address,
        account1.address,
        account1.address,
        collateralAmount,
        ethers.parseEther("20000") // the Max Dai to barrow when the real price is 3000
      );
      await vat.connect(account1).hope(daiJoinAddress);
      await daiJoin
        .connect(account1)
        .exit(account1.address, ethers.parseEther("20000"));
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour
      await ethers.provider.send("evm_mine");
      await osm.poke();
      await spotter.poke(ilk);
      await dog["file(bytes32,uint256)"](
        encodeBytes32String("Hole"),
        BigInt(150000000000000000000000000000000000000000000000000000) // Max system-wide debt to liquidate
      );
      await dog["file(bytes32,bytes32,uint256)"](
        encodeBytes32String("ETH-A"),
        encodeBytes32String("hole"),
        BigInt(40000000000000000000000000000000000000000000000000000) // Max debt for ETH-A to liquidate
      );
      await dog["file(bytes32,bytes32,uint256)"](
        ilk,
        encodeBytes32String("chop"),
        ethers.parseEther("1.13")
      );
      await dog["file(bytes32,address)"](
        encodeBytes32String("vow"),
        vowAddress
      );
      await dog["file(bytes32,bytes32,address)"](
        ilk,
        encodeBytes32String("clip"),
        clipAddress
      );

      console.log(await vat.urns(ilk, account1.address));
      const result = await dog.bark(ilk, account1.address, account1.address);
      console.log(await vat.urns(ilk, account1.address));
    });
    it("Initiate An Auction for Undercollaterized Vault", async function () {
      const [owner, account1, bidder1, bidder2] = await hre.ethers.getSigners();
      spotter["file(bytes32,bytes32,address)"](
        ilk,
        encodeBytes32String("pip"),
        osmAddress
      );
      spotter["file(bytes32,bytes32,uint256)"](
        ilk,
        encodeBytes32String("mat"),
        "1500000000000000000000000000"
      );
      await median["kiss(address)"](osmAddress); // let the osm fetch the price from median
      await median["kiss(address)"](owner.address); // let the owner fetch the price from median
      await osm["kiss(address)"](spotterAddress); // let the spotter fetch the price from osm
      await osm["kiss(address)"](clipAddress); // let the clip fetch the price from osm
      await osm["kiss(address)"](owner.address); // let the owner addrest peek the price
      await dai.connect(owner).rely(daiJoinAddress); // let the daiJoin mint dai
      await vat.connect(owner).rely(ethJoinAddress); // let the ethJoin update the user's balance
      await vat.connect(owner).rely(spotterAddress); // let the spotter update the illk.spot
      await vat.connect(owner).rely(dogAddress);
      await vat.connect(owner).init(ilk);
      await median.lift([owner.address]);
      await clip.connect(owner).rely(dogAddress); // let the dog call kik
      await clip.upchost(); // update the chost
      const initialPrice = ethers.parseEther("3000");
      const age1 = (await ethers.provider.getBlock("latest"))?.timestamp; // Current timestamp
      await median.poke([initialPrice], [age1], [owner.address]);
      await osm.poke();
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour
      await ethers.provider.send("evm_mine");
      const updatedPrice = ethers.parseEther("2900"); // New price
      const age2 = (await ethers.provider.getBlock("latest"))?.timestamp; // Updated timestamp after 1 hour
      await median.poke([updatedPrice], [age2], [owner.address]);
      await osm.poke();
      await spotter.poke(ilk);
      const collateralAmount = ethers.parseEther("10");
      await ethJoin
        .connect(account1)
        .join(account1.address, { value: collateralAmount });
      await vat.connect(account1).frob(
        ilk,
        account1.address,
        account1.address,
        account1.address,
        collateralAmount,
        ethers.parseEther("20000") // the Max Dai to barrow when the real price is 3000
      );
      await vat.connect(account1).hope(daiJoinAddress);
      await daiJoin
        .connect(account1)
        .exit(account1.address, ethers.parseEther("20000"));
      {
        const collateralAmount = ethers.parseEther("20");
        await ethJoin
          .connect(bidder1)
          .join(bidder1.address, { value: collateralAmount });
        await vat.connect(bidder1).frob(
          ilk,
          bidder1.address,
          bidder1.address,
          bidder1.address,
          collateralAmount,
          ethers.parseEther("40000") // the Max Dai to barrow when the real price is 3000
        );
        console.log(
          "vat.dai(bidder1.address): ",
          await vat.dai(bidder1.address)
        );
        await vat.connect(bidder1).hope(daiJoinAddress);
        // await daiJoin
        //   .connect(bidder1)
        //   .exit(bidder1.address, ethers.parseEther("20000"));
      }
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour
      await ethers.provider.send("evm_mine");
      await osm.poke();
      await spotter.poke(ilk);
      await dog["file(bytes32,uint256)"](
        encodeBytes32String("Hole"),
        BigInt(150000000000000000000000000000000000000000000000000000) // Max system-wide debt to liquidate
      );
      await dog["file(bytes32,bytes32,uint256)"](
        encodeBytes32String("ETH-A"),
        encodeBytes32String("hole"),
        BigInt(40000000000000000000000000000000000000000000000000000) // Max debt for ETH-A to liquidate
      );
      await dog["file(bytes32,bytes32,uint256)"](
        ilk,
        encodeBytes32String("chop"),
        ethers.parseEther("1.13")
      );
      await dog["file(bytes32,address)"](
        encodeBytes32String("vow"),
        vowAddress
      );
      await dog["file(bytes32,bytes32,address)"](
        ilk,
        encodeBytes32String("clip"),
        clipAddress
      );
      await dog.bark(ilk, account1.address, account1.address);

      await clip["file(bytes32,address)"](
        encodeBytes32String("calc"),
        abaciAddress
      );
      await clip["file(bytes32,uint256)"](encodeBytes32String("tail"), 3600);
      await vat.connect(bidder1).hope(clipAddress);
      await dog.rely(clipAddress);
      await abaci.file(encodeBytes32String("tau"), 3600);
      const balancebefore = await hre.ethers.provider.getBalance(bidder1.address)
      console.log("balance before: ", balancebefore);
      await clip
        .connect(bidder1)
        .take(
          1,
          collateralAmount,
          "2900000000000000000000000000000",
          bidder1.address,
          "0x"
        );
      console.log("balance after: ", await hre.ethers.provider.getBalance(bidder1.address));
      console.log("balance : ",  balancebefore - await hre.ethers.provider.getBalance(bidder1.address));

    });
  });
});

// it("Recover Valid Address", async function () {
//   const [owner, account1] = await hre.ethers.getSigners();
//   const { median } = await deployMedian();

//   const MessageVerifier = await hre.ethers.getContractFactory(
//     "MessageVerifier"
//   );
//   const messageVerifier = await MessageVerifier.deploy();
//   // const hashedMessage = await ethers.hashMessage("Hello")
//   const signature = await owner.signMessage("hello");
//   const recove = await ethers.recoverAddress(
//     ethers.hashMessage("hello"),
//     signature
//   ); // => owner address
//   const isValid = await messageVerifier.verifySignature("hello", signature);
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
// });
