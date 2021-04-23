async function main() {
    const factoryAddress = "0x24c4AeB668D4fEae44B330EC93fF3C83BeBcf46E";

    const CentaurFactoryContract = await ethers.getContractFactory("CentaurFactory");
    const CentaurFactory = await CentaurFactoryContract.attach(factoryAddress);

    await(await CentaurFactory.setAllPoolsTradeEnabled(true)).wait();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});