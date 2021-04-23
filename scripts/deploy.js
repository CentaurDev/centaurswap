const hre = require("hardhat");
const BigNumber = ethers.BigNumber;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    let gas = BigNumber.from(0);

    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());
    console.log("");
    // Deploy CentaurMath
    const CentaurMathContract = await ethers.getContractFactory("CentaurMath");
    const CentaurMath = await CentaurMathContract.deploy();
    console.log("CentaurMath Address:", CentaurMath.address);
    // console.log(await CentaurMath.deployTransaction.wait());
    gas = gas.add((await CentaurMath.deployTransaction.wait()).gasUsed);


    // Deploy PoolLogic
    const CentaurPoolContract = await ethers.getContractFactory("CentaurPool", {
        libraries: {
          CentaurMath: CentaurMath.address
        }
    });
    const CentaurPoolLogic = await CentaurPoolContract.deploy();
    console.log("CentaurPoolLogic Address:", CentaurPoolLogic.address);
    gas = gas.add((await CentaurPoolLogic.deployTransaction.wait()).gasUsed);


    // Deploy / Attach CloneFactory
    const CloneFactoryContract = await ethers.getContractFactory("CloneFactory");
    const CloneFactory = await CloneFactoryContract.attach("0x0dEb1A88002d54aE993E9Dc341a7e9d78fBfDAac");
    console.log("CloneFactory Address:", CloneFactory.address);
    // gas = gas.add((await CloneFactory.deployTransaction.wait()).gasUsed);


    
    // WETH Mainnet = 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    // WETH Rinkeby = 0x63dfc7d7ffaf18696ed78fa26c0528f609a660fd
    const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // WETH ADDRESS !!!! NEED TO CHANGE

    // Deploy CentaurFactory
    const CentaurFactoryContract = await ethers.getContractFactory("CentaurFactory");
    const CentaurFactory = await CentaurFactoryContract.deploy(
        CentaurPoolLogic.address, 
        CloneFactory.address, 
        WETH // WETH ADDRESS !!!! NEED TO CHANGE
    );
    console.log("CentaurFactory Address:", CentaurFactory.address);
    gas = gas.add((await CentaurFactory.deployTransaction.wait()).gasUsed);


    // Attach Router
    const CentaurRouterContract = await ethers.getContractFactory("CentaurRouter");
    const CentaurRouter = await CentaurRouterContract.attach(await CentaurFactory.router());
    console.log("CentaurRouter Address:", CentaurRouter.address);


    // Attach Settlement
    const CentaurSettlementContract = await ethers.getContractFactory("CentaurSettlement");
    const CentaurSettlement = await CentaurSettlementContract.attach(await CentaurFactory.settlement());
    console.log("CentaurSettlement Address:", CentaurSettlement.address);


    // Change settlement to 1min for testing
    // Comment out for prod
    // await CentaurSettlement.setSettlementDuration(60);
    
    // Create Pools
    // WETH POOL
    await (await CentaurFactory.createPool(WETH, "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", ethers.utils.parseEther("100"))).wait();
    // DAI POOL
    await (await CentaurFactory.createPool("0x6b175474e89094c44da98b954eedeac495271d0f", "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9", ethers.utils.parseEther("1000000"))).wait();
    // USDT POOL
    await (await CentaurFactory.createPool("0xdac17f958d2ee523a2206206994597c13d831ec7", "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D", "1000000000000")).wait();

    const MWETHPool = await CentaurFactory.allPools(0);
    const MDAIPool = await CentaurFactory.allPools(1);
    const MUSDTPool = await CentaurFactory.allPools(2);
    
    console.log("MWETH Pool Created:", MWETHPool);
    console.log("MDAI Pool Created:", MDAIPool);
    console.log("MUSDT Pool Created:", MUSDTPool);

    // Deploy WheyFarm
    // const WheyFarmContract = await ethers.getContractFactory("WheyFarm");
    // const WheyFarm = await WheyFarmContract.deploy(deployer.address, ethers.utils.parseEther("100"), 0, 0);
    // console.log("WheyFarm Address:", WheyFarm.address);
    // gas = gas.add((await WheyFarm.deployTransaction.wait()).gasUsed);

    // Add pools to farm
    // await WheyFarm.add(100, MWBTCPool, false);
    // await WheyFarm.add(100, MWETHPool, false);
    // await WheyFarm.add(100, MUSDTPool, false);
    // await WheyFarm.add(100, MDAIPool, false);

    console.log("\nTotal Gas Used For Deployment:", gas.toString());

    console.log("\nWaiting for 1 minute before verification");
    await sleep(60000);


    await hre.run("verify:verify", {
        address: CentaurMath.address
    });
    await hre.run("verify:verify", {
        address: CentaurPoolLogic.address
    });
    await hre.run("verify:verify", {
        address: CloneFactory.address
    });
    await hre.run("verify:verify", {
        address: CentaurFactory.address,
        constructorArguments: [
            CentaurPoolLogic.address,
            CloneFactory.address, 
            WETH
        ],
    });
    await hre.run("verify:verify", {
        address: CentaurRouter.address,
        constructorArguments: [
            CentaurFactory.address,
            WETH
        ],
    });
    await hre.run("verify:verify", {
        address: CentaurSettlement.address,
        constructorArguments: [
            CentaurFactory.address,
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