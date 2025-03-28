import { ethers } from "hardhat";
import { deployLibrary } from "../test/helpers";
import { EncryptedERC__factory } from "../typechain-types";
import { deployProductionVerifiers } from "./helpers";

const main = async () => {
	// get deployer
	const [deployer] = await ethers.getSigners();

	// deploy verifiers
	const {
		registrationVerifier,
		mintVerifier,
		withdrawVerifier,
		transferVerifier,
	} = await deployProductionVerifiers(deployer);

	// deploy babyjub library
	const babyJubJub = await deployLibrary(deployer);

	// deploy registrar contract
	const registrarFactory = await ethers.getContractFactory("Registrar");
	const registrar = await registrarFactory.deploy(registrationVerifier);
	await registrar.waitForDeployment();

	// deploy eERC20
	const encryptedERCFactory = new EncryptedERC__factory({
		"contracts/libraries/BabyJubJub.sol:BabyJubJub": babyJubJub,
	});
	const encryptedERC_ = await encryptedERCFactory.connect(deployer).deploy({
		registrar: registrar.target,
		isConverter: true, // This is a converter eERC
		name: "", // unused
		symbol: "", // unused
		mintVerifier,
		withdrawVerifier,
		transferVerifier,
		decimals: 18,
	});
	await encryptedERC_.waitForDeployment();

	console.table({
		registrationVerifier,
		mintVerifier,
		withdrawVerifier,
		transferVerifier,
		babyJubJub,
		registrar: registrar.target,
		encryptedERC: encryptedERC_.target,
	});

	console.log("\nWaiting for block confirmations before verification...");
	await new Promise(resolve => setTimeout(resolve, 30000)); // 30 second delay

	console.log("\nStarting contract verification...");
	try {
		await run("verify:verify", {
			address: await registrar.getAddress(),
			constructorArguments: [registrationVerifier],
		});
		console.log("Registrar contract verified!");

		await run("verify:verify", {
			address: encryptedERC_.target,
			constructorArguments: [{
				registrar: await registrar.getAddress(),
				isConverter: true,
				name: "",
				symbol: "",
				mintVerifier,
				withdrawVerifier,
				transferVerifier,
				decimals: 18,
			}],
		});
		console.log("EncryptedERC contract verified!");
	} catch (error) {
		console.error("Verification failed:", error);
	}
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});