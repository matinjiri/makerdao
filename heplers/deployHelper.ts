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
export const deployVow = async (vat_: AddressLike) => {
  const Vow = await hre.ethers.getContractFactory("Vow");
  const vow = await Vow.deploy(vat_);
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
