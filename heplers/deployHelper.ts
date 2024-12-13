import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers, web3 } from "hardhat";
import {
  AddressLike,
  BigNumberish,
  BytesLike,
  encodeBytes32String,
} from "ethers";
import {
  Clipper,
  Dai,
  DaiJoin,
  Dog,
  ETHJoin,
  Median,
  OSM,
  Spotter,
  Vat,
  Vow,
} from "../typechain-types";

export const deployDAI = async () => {
  const DAI = await hre.ethers.getContractFactory("Dai");
  const dai = await DAI.deploy(1);
  return { dai };
};
export const deployVat = async () => {
  const VAT = await hre.ethers.getContractFactory("Vat");
  const vat = await VAT.deploy();
  return { vat };
};
export const deployDAIJoin = async (vat_: AddressLike, dai: AddressLike) => {
  const DAIJoin = await hre.ethers.getContractFactory("DaiJoin");
  const daiJoin = await DAIJoin.deploy(vat_, dai);
  return { daiJoin };
};
export const deployETHJoin = async (vat_: AddressLike, ilk: BytesLike) => {
  const ETHJoin = await hre.ethers.getContractFactory("ETHJoin");
  const ethJoin = await ETHJoin.deploy(vat_, ilk);
  return { ethJoin };
};
export const deploySpotter = async (vat_: AddressLike) => {
  const SPOTTER = await hre.ethers.getContractFactory("Spotter");
  const spotter = await SPOTTER.deploy(vat_);
  return { spotter };
};
export const deployMedian = async () => {
  const Median = await hre.ethers.getContractFactory("Median");
  const median = await Median.deploy();
  return { median };
};
export const deployOSM = async (src: AddressLike) => {
  const OSM = await hre.ethers.getContractFactory("OSM");
  const osm = await OSM.deploy(src);
  return { osm };
};
export const deployDog = async (vat_: AddressLike) => {
  const Dog = await hre.ethers.getContractFactory("Dog");
  const dog = await Dog.deploy(vat_);
  return { dog };
};
export const deployVow = async (
  vat_: AddressLike,
  flapper_: AddressLike,
  flopper_: AddressLike
) => {
  const Vow = await hre.ethers.getContractFactory("Vow");
  const vow = await Vow.deploy(vat_, flapper_, flapper_);
  return { vow };
};
export const deployClip = async (
  vat_: AddressLike,
  spotter_: AddressLike,
  dog_: AddressLike,
  ilk_: BytesLike
) => {
  const Clip = await hre.ethers.getContractFactory("Clipper");
  const clip = await Clip.deploy(vat_, spotter_, dog_, ilk_);
  return { clip };
};
export const deployAbaci = async () => {
  const LinearDecrease = await hre.ethers.getContractFactory("LinearDecrease");
  const abaci = await LinearDecrease.deploy();
  return { abaci };
};
export const deployFlap = async (vat_: AddressLike, gem_: AddressLike) => {
  const Flapper = await hre.ethers.getContractFactory("Flapper");
  const flap = await Flapper.deploy(vat_, gem_);
  return { flap };
};
export const deployFlop = async (vat_: AddressLike, gem_: AddressLike) => {
  const Flopper = await hre.ethers.getContractFactory("Flopper");
  const flop = await Flopper.deploy(vat_, gem_);
  return { flop };
};
export const deployMkr = async () => {
  const Mkr = await hre.ethers.getContractFactory("MKR");
  const mkr = await Mkr.deploy("MKR");
  return { mkr };
};
export const deploySpell = async (
  whom_: AddressLike,
  mana_: BigNumberish,
  data_: BytesLike
) => {
  const Spell = await hre.ethers.getContractFactory("DSSpell");
  const spell = await Spell.deploy(whom_, mana_, data_);
  return { spell };
};
export const deployPause = async (
  delay_: BigNumberish,
  owner_: AddressLike,
  authority_: AddressLike
) => {
  const Pause = await hre.ethers.getContractFactory("DSPause");
  const pause = await Pause.deploy(delay_, owner_, authority_);
  return { pause };
};
