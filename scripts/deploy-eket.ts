import { ethers, run } from "hardhat";
import { deployLibrary, deployVerifiers } from "../test/helpers";
import { EncryptedERC__factory } from "../typechain-types";

const main = async () => {
	// get deployer
	const [deployer] = await ethers.getSigners();

	// deploy verifiers with proper trusted setup
	const {
		registrationVerifier,
		mintVerifier,
		withdrawVerifier,
		transferVerifier,
	} = await deployVerifiers(deployer, true);

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
		name: "encrypted yellow ket",
		symbol: "eKET",
		mintVerifier,
		withdrawVerifier,
		transferVerifier,
		decimals: 18,
		convertedToken: "0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7",
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

	// Verify Registration Verifier contract
	try {
		await run("verify:verify", {
			address: registrationVerifier,
			constructorArguments: [],
		});
		console.log("Registration Verifier contract verified!");
	} catch (error) {
		console.error("Registration Verifier verification failed:", error);
	}

	// Verify Mint Verifier contract
	try {
		await run("verify:verify", {
			address: mintVerifier,
			constructorArguments: [],
		});
		console.log("Mint Verifier contract verified!");
	} catch (error) {
		console.error("Mint Verifier verification failed:", error);
	}

	// Verify Withdraw Verifier contract
	try {
		await run("verify:verify", {
			address: withdrawVerifier,
			constructorArguments: [],
		});
		console.log("Withdraw Verifier contract verified!");
	} catch (error) {
		console.error("Withdraw Verifier verification failed:", error);
	}

	// Verify Transfer Verifier contract
	try {
		await run("verify:verify", {
			address: transferVerifier,
			constructorArguments: [],
		});
		console.log("Transfer Verifier contract verified!");
	} catch (error) {
		console.error("Transfer Verifier verification failed:", error);
	}

	// Verify BabyJubJub library
	try {
		await run("verify:verify", {
			address: babyJubJub,
			constructorArguments: [],
		});
		console.log("BabyJubJub library verified!");
	} catch (error) {
		console.error("BabyJubJub verification failed:", error);
	}

	// Verify Registrar contract
	try {
		await run("verify:verify", {
			address: registrar.target,
			constructorArguments: [registrationVerifier],
		});
		console.log("Registrar contract verified!");
	} catch (error) {
		console.error("Registrar verification failed:", error);
	}

	// Verify EncryptedERC contract
	try {
		await run("verify:verify", {
			address: encryptedERC_.target,
			constructorArguments: [{
				registrar: registrar.target,
				isConverter: true,
				name: "encrypted yellow ket",
				symbol: "eKET",
				mintVerifier,
				withdrawVerifier,
				transferVerifier,
				decimals: 18,
				convertedToken: "0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7",
			}],
		});
		console.log("EncryptedERC contract verified!");
	} catch (error) {
		console.error("EncryptedERC verification failed:", error);
	}
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});