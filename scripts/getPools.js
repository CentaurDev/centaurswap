async function main() {
    const factoryAddress = "0x22a645BEcC50075Dddae97d839fcb19261EA5fB0";

    const CentaurFactoryContract = await ethers.getContractFactory("CentaurFactory");
    const CentaurFactory = await CentaurFactoryContract.attach(factoryAddress);

    console.log("MWETH Pool Address:", await CentaurFactory.allPools(0));
    console.log("MUSDT Pool Address:", await CentaurFactory.allPools(1));
    console.log("MDAI Pool Address:", await CentaurFactory.allPools(2));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});