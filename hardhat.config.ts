import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@solarity/chai-zkit";
import "@solarity/hardhat-zkit";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import type { HardhatUserConfig } from "hardhat/config";
import "solidity-coverage";

import dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://api.avax.network/ext/bc/C/rpc";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY || "";

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.27",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			forking: {
				url: RPC_URL,
				blockNumber: 59121339,
				enabled: !!process.env.FORKING,
			},
		},
		avaxTest: {
			url: "https://api.avax-test.network/ext/bc/C/rpc",
			accounts: [PRIVATE_KEY],
			chainId: 43113,
		},
		avaxMain: {
			url: "https://api.avax.network/ext/bc/C/rpc",
			accounts: [PRIVATE_KEY],
			chainId: 43114,
		},
	},
	gasReporter: {
		enabled: !!process.env.REPORT_GAS,
		currency: "USD",
		coinmarketcap: process.env.COINMARKETCAP_API_KEY,
		excludeContracts: ["contracts/mocks/"],
		outputFile: "gas-report.txt",
		L1: "avalanche",
		showMethodSig: true,
	},
	zkit: {
		compilerVersion: "2.1.9",
		circuitsDir: "circom",
		compilationSettings: {
			artifactsDir: "zkit/artifacts",
			onlyFiles: [],
			skipFiles: [],
			c: false,
			json: false,
			optimization: "O2",
		},
		setupSettings: {
			contributionSettings: {
				provingSystem: "groth16",
				contributions: 0,
			},
			onlyFiles: [],
			skipFiles: [],
			ptauDir: undefined,
			ptauDownload: true,
		},
		verifiersSettings: {
			verifiersDir: "contracts/verifiers",
			verifiersType: "sol",
		},
		typesDir: "generated-types/zkit",
		quiet: false,
	},
	etherscan: {
		apiKey: {
			avalanche: SNOWTRACE_API_KEY,
			avalancheFujiTestnet: SNOWTRACE_API_KEY
		},
		customChains: [
			{
				network: "avalanche",
				chainId: 43114,
				urls: {
					apiURL: "https://api.snowtrace.io/api",
					browserURL: "https://snowtrace.io/"
				}
			},
			{
				network: "avalancheFujiTestnet",
				chainId: 43113,
				urls: {
					apiURL: "https://api-testnet.snowtrace.io/api",
					browserURL: "https://testnet.snowtrace.io/"
				}
			}
		]
	},
};

export default config;
