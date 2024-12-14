import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers, web3 } from "hardhat";
import {
  AddressLike,
  BytesLike,
  encodeBytes32String,
  parseUnits,
} from "ethers";
import {
  Clipper,
  Dai,
  DaiJoin,
  Dog,
  DSToken,
  ETHJoin,
  Flapper,
  Flopper,
  LinearDecrease,
  Median,
  OSM,
  Spotter,
  Vat,
  Vow,
  DSSpell,
  DSPause,
  DSChief,
  Jug,
  Pot,
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
    abaci: LinearDecrease,
    mkr: DSToken,
    flap: Flapper,
    flop: Flopper,
    jug: Jug,
    pot: Pot;
  // spell: DSSpell,
  // pause: DSPause;
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
    abaciAddress: AddressLike,
    mkrAddress: AddressLike,
    flapAddress: AddressLike,
    flopAddress: AddressLike,
    spellAddress: AddressLike,
    pauseAddress: AddressLike,
    jugAddress: AddressLike,
    potAddress: AddressLike;
  beforeEach(async function () {
    ({ dai } = await loadFixture(helper.deployDAI));
    ({ vat } = await helper.deployVat());
    ({ daiJoin } = await helper.deployDAIJoin(vat, dai));
    ({ median } = await helper.deployMedian());
    ({ osm } = await helper.deployOSM(await median.getAddress()));
    ({ ethJoin } = await helper.deployETHJoin(vat, ilk));
    ({ spotter } = await helper.deploySpotter(vat));
    ({ dog } = await helper.deployDog(vat));
    ({ clip } = await helper.deployClip(vat, spotter, dog, ilk));
    ({ abaci } = await helper.deployAbaci());
    ({ mkr } = await helper.deployMkr());
    ({ flap } = await helper.deployFlap(vat, mkr));
    ({ flop } = await helper.deployFlop(vat, mkr));
    ({ vow } = await helper.deployVow(vat, flap, flop));
    ({ jug } = await helper.deployJug(vat));
    ({ pot } = await helper.deployPot(vat));
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
    flapAddress = await flap.getAddress();
    flopAddress = await flop.getAddress();
    mkrAddress = await mkr.getAddress();
    jugAddress = await jug.getAddress();
    potAddress = await pot.getAddress();
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
    it("Should deploy Vow", async function () {
      expect(vow).to.exist;
    });
    it("Should deploy MKR", async function () {
      expect(mkr).to.exist;
    });
    it("Should deploy Flopper", async function () {
      expect(flop).to.exist;
    });
    it("Should deploy Flapper", async function () {
      expect(flap).to.exist;
    });
    it("Should deploy Jug", async function () {
      expect(jug).to.exist;
    });
    it("Should deploy Pot", async function () {
      expect(pot).to.exist;
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
      await vow.rely(dogAddress);

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
      await clip["file(bytes32,address)"](
        encodeBytes32String("calc"),
        abaciAddress
      );
      await clip["file(bytes32,uint256)"](encodeBytes32String("tail"), 3600);
      await clip["file(bytes32,address)"](
        encodeBytes32String("vow"),
        vowAddress
      );
      await vow.rely(dogAddress);
      console.log(
        "vat.gem(ilk, clipAddress) ",
        await vat.gem(ilk, clipAddress)
      );
      const tx = await dog.bark(ilk, account1.address, account1.address);
      const receipt = await tx.wait();
      // Fetch the block timestamp (this is the `era` when debt was queued)
      const era = (await ethers.provider.getBlock(receipt?.blockHash))
        .timestamp;
      await vat.connect(bidder1).hope(clipAddress);
      await dog.rely(clipAddress);
      await abaci.file(encodeBytes32String("tau"), 3600);
      await clip
        .connect(bidder1)
        .take(
          1,
          collateralAmount,
          "2900000000000000000000000000000",
          bidder1.address,
          "0x"
        );
      console.log("vat.dai(vowAddress) ", await vat.dai(vowAddress));
      console.log("vat.sin(vowAddress) ", await vat.sin(vowAddress));
      console.log("vow.Ash() ", await vow.Ash());
      console.log("vat.vice() ", await vat.vice());
      console.log("vow.Sin() ", await vow.Sin());

      await vow.flog(era);
      console.log("vow.Sin() ", await vow.Sin());
      await vow.heal(20000000000000000000000000000000000000000000000000n);
      console.log("vat.dai(vowAddress) ", await vat.dai(vowAddress));
      console.log("vat.sin(vowAddress) ", await vat.sin(vowAddress));
      console.log("vow.Ash() ", await vow.Ash());
      console.log("vat.vice() ", await vat.vice());
    });
    it("Flap On Surplus Debt", async function () {
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
      await clip["file(bytes32,address)"](
        encodeBytes32String("calc"),
        abaciAddress
      );
      await clip["file(bytes32,uint256)"](encodeBytes32String("tail"), 3600);
      await clip["file(bytes32,address)"](
        encodeBytes32String("vow"),
        vowAddress
      );
      await vow.rely(dogAddress);
      const tx = await dog.bark(ilk, account1.address, account1.address);
      const receipt = await tx.wait();
      // Fetch the block timestamp (this is the `era` when debt was queued)
      const era = (await ethers.provider.getBlock(receipt?.blockHash))
        .timestamp;
      await vat.connect(bidder1).hope(clipAddress);
      await dog.rely(clipAddress);
      await abaci.file(encodeBytes32String("tau"), 3600);
      await clip
        .connect(bidder1)
        .take(
          1,
          collateralAmount,
          "2900000000000000000000000000000",
          bidder1.address,
          "0x"
        );
      await vow.flog(era);
      await vow.heal(20000000000000000000000000000000000000000000000000n);
      await flap.rely(vowAddress);
      await flap.file(
        encodeBytes32String("lid"), // max dai to be in auction at one time
        20000000000000000000000000000000000000000000000000n
      );
      await flap.file(
        encodeBytes32String("tau"),
        3600 // 1-hour auctions
      );
      await flap.file(
        encodeBytes32String("ttl"),
        300 // 5 minutes between bids
      );
      await vow["file(bytes32,uint256)"](
        encodeBytes32String("bump"),
        ethers.parseUnits("10", 45)
      );
      await vow.flap();
      await mkr.rely(flapAddress); // let the flap burn mkr
      await mkr["mint(address,uint256)"](
        bidder2.address,
        ethers.parseEther("0.5")
      );
      await mkr
        .connect(bidder2)
        ["approve(address,uint256)"](flapAddress, ethers.parseEther("0.5"));
      await flap.connect(bidder2).tend(
        1, // ID of the auction
        ethers.parseUnits("10", 45), // Amount of DAI you want
        ethers.parseEther("0.5") // MKR you’re bidding
      );
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour
      await ethers.provider.send("evm_mine");
      await flap.deal(1);
      await vat.connect(bidder2).hope(daiJoinAddress);
      console.log(await vat.dai(bidder2));
      await daiJoin
        .connect(bidder2)
        .exit(bidder2.address, ethers.parseEther("10"));
      console.log(await vat.dai(bidder2));
      console.log(await dai.balanceOf(bidder2.address));
    });
    it("Should Apply The Stability Fee And Accrue Interest", async function () {
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
      await median["kiss(address)"](osmAddress); // let the osm fetch the price from median
      await median["kiss(address)"](owner.address); // let the owner fetch the price from median
      await osm["kiss(address)"](spotterAddress); // let the spotter fetch the price from osm
      await osm["kiss(address)"](owner.address); // let the owner addrest peek the price
      await dai.connect(owner).rely(daiJoinAddress); // let the daiJoin mint dai
      await vat.connect(owner).rely(ethJoinAddress); // let the ethJoin update the user's balance
      await vat.connect(owner).rely(spotterAddress); // let the spotter update the illk.spot
      await vat.connect(owner).init(ilk);
      await median.lift([owner.address]);
      const initialPrice = ethers.parseEther("3000");
      const age1 = (await ethers.provider.getBlock("latest"))?.timestamp; // Current timestamp
      await median.poke([initialPrice], [age1], [owner.address]);
      await osm.poke();
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour
      await ethers.provider.send("evm_mine");
      const updatedPrice = ethers.parseEther("3000"); // New price
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
        ethers.parseEther("20000") // the Max Dai
      );
      await vat.connect(account1).hope(daiJoinAddress); // account lets the daiJoin have accesee to my balance in vat
      await daiJoin
        .connect(account1)
        .exit(account1.address, ethers.parseEther("20000"));
      await vat.rely(jugAddress);
      await jug.init(ilk);
      await ethers.provider.send("evm_increaseTime", [36000000]);
      await ethers.provider.send("evm_mine");

      console.log(await vat.dai(vowAddress));

      await jug.drip(ilk);
      // todo: i dont know how to update the rate for specefic ilk
      // await jug["file(bytes32,bytes32,uint256)"](
      //   ilk,
      //   ethers.encodeBytes32String("duty"),
      //   ethers.parseUnits("10", 27)
      // );
      console.log(await vat.dai(vowAddress));
    });
    it("Should Deposit Dai, Accrue Interest, And Withdraw With Accrued Interest", async function () {
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
      await median["kiss(address)"](osmAddress); // let the osm fetch the price from median
      await median["kiss(address)"](owner.address); // let the owner fetch the price from median
      await osm["kiss(address)"](spotterAddress); // let the spotter fetch the price from osm
      await osm["kiss(address)"](owner.address); // let the owner addrest peek the price
      await dai.connect(owner).rely(daiJoinAddress); // let the daiJoin mint dai
      await vat.connect(owner).rely(ethJoinAddress); // let the ethJoin update the user's balance
      await vat.connect(owner).rely(spotterAddress); // let the spotter update the illk.spot
      await vat.connect(owner).init(ilk);
      await median.lift([owner.address]);
      const initialPrice = ethers.parseEther("3000");
      const age1 = (await ethers.provider.getBlock("latest"))?.timestamp; // Current timestamp
      await median.poke([initialPrice], [age1], [owner.address]);
      await osm.poke();
      await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour
      await ethers.provider.send("evm_mine");
      const updatedPrice = ethers.parseEther("3000"); // New price
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
        ethers.parseEther("20000") // the Max Dai
      );
      await vat.rely(potAddress);
      // todo: deposit dai to pot
      await pot.connect(account1).join(ethers.parseEther("20000"));
      console.log(await pot.pie(account1.address));
      
    });
  });

  // todo
  describe("Govern The Protocol", async function () {
    it("Updates the minimum debt floor for vault", async function () {
      const ilk = ethers.keccak256(ethers.toUtf8Bytes("ETH-A"));
      const what = ethers.keccak256(ethers.toUtf8Bytes("ETH-A"));
      const abiCoder = new ethers.AbiCoder();
      const encoded = abiCoder.encode(
        ["bytes32", "bytes32", "uint256"],
        [ilk, what, 10000000000000000000000n]
      );

      // deploy spell for updating the dust
      const { spell: DSSpell } = await helper.deploySpell(
        vatAddress,
        0,
        encoded
      );
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
