const hre = require("hardhat");
const BigNumber = ethers.BigNumber;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    await hre.run("verify:verify", {
        address: "0xFE40675976c6DBECaD7B98B07c29F1cD90E70129"
    });
    await hre.run("verify:verify", {
        address: "0x5ED972254112cE134B0Ac6816d4FA97C02Ac2f3A"
    });
    // await hre.run("verify:verify", {
    //     address: CloneFactory.address
    // });
    await hre.run("verify:verify", {
        address: "0x0a6F16ED7895ec475f62dc8613dbAa84Ee407ff8",
        constructorArguments: [
            "0x5ED972254112cE134B0Ac6816d4FA97C02Ac2f3A",
            "0x0dEb1A88002d54aE993E9Dc341a7e9d78fBfDAac", 
            "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        ],
    });
    await hre.run("verify:verify", {
        address: "0x018612ab9B9038FC0e9eDd06F255D82476eFE6dd",
        constructorArguments: [
            "0x0a6F16ED7895ec475f62dc8613dbAa84Ee407ff8",
            "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        ],
    });
    await hre.run("verify:verify", {
        address: "0x863D24C97Ad773C90f9E76092e88C7051B4d2576",
        constructorArguments: [
            "0x0a6F16ED7895ec475f62dc8613dbAa84Ee407ff8",
            180
        ],
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});