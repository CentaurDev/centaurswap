const hre = require("hardhat");

var emissionSchedule = require('./emissionSchedule.json');
var emissionPerEpoch = require('./emissionPerEpoch.json');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Deploy WheyFarm
    const WheyFarmContract = await ethers.getContractFactory("WheyFarm");
    const WheyFarm = await WheyFarmContract.attach("0x7f99c3E587A168aea5fF1Fc0f840Ba7A0163d00A");
    // const WheyFarm = await WheyFarmContract.deploy(
    //     "0x2132DE4fFfE211122819a0135E572784c403B595", // WHEY receiver
    //     blockHeight + 50, // startBlock
    //     emissionSchedule, 
    //     emissionPerEpoch
    // );
    console.log("WheyFarm Address:", WheyFarm.address);

    //console.log("Farm Start Block:", blockHeight + 50);

    const WHEY = await WheyFarm.whey();
    console.log("WHEY Token Address:", WHEY);

    // const WHEY = "0xCa5d29B3e74D59EBcDF09111495d86F319886A40";
    // const WHEY_LP = "0xbC9bF17f37b5dD6df961233240aDE103b41c521E";
    // const CNTR_LP = "0xa12b7a78a31854d2e9ee8fbc92e262aaf4fcd4f1";
    // const MWETHPool = "0x8Da12B9De56C566bDc67BDd5a7881D368B510294";
    // const MDAIPool = "0xd0d59525Afc725237FD254332A8CFe9bF9D24327";
    // const MUSDTPool = "0xC37c4117C8D75fAD65614D1B7533E340CEE78460";

    // Add pools to farm
    // await (await WheyFarm.add(200, WHEY, false)).wait();
    // await (await WheyFarm.add(300, WHEY, false)).wait();
    // await (await WheyFarm.add(300, WHEY, false)).wait();
    // await (await WheyFarm.add(100, MWETHPool, false)).wait();
    // await (await WheyFarm.add(100, MDAIPool, false)).wait();
    // await (await WheyFarm.add(100, MUSDTPool, false)).wait();

    await (await WheyFarm.updateWheyEmission(emissionSchedule, emissionPerEpoch)).wait();

    // console.log("\nWaiting for 1 minute before verification");
    // await sleep(60000);

    // await hre.run("verify:verify", {
    //     address: WheyFarm.address,
    //     constructorArguments: [
    //         "0x2132DE4fFfE211122819a0135E572784c403B595", // WHEY receiver
    //         blockHeight + 50, // startBlock
    //         emissionSchedule, 
    //         emissionPerEpoch
    //     ],
    // });

    // await hre.run("verify:verify", {
    //     address: "0xCa5d29B3e74D59EBcDF09111495d86F319886A40"
    // });
}
main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});