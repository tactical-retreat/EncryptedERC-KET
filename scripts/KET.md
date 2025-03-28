# Updates to deploy for KET

* Added `deploy-converter-simple.ts` - no need to deploy an ERC20
* Hardcoded decimals to 18
* Removed unused name/symbol

Updated `hardhat.config.ts` to include mainnet and testnet configs.

Added support for verification:

```
npm install --save-dev @nomicfoundation/hardhat-verify
```

To deploy:

```
# First, create .env with
# PRIVATE_KEY=private_key_without_0x_prefix
# SNOWTRACE_API_KEY=your_snowtrace_api_key_here

npx hardhat run scripts/deploy-converter-simple.ts --network avaxTest
npx hardhat run scripts/deploy-converter-simple.ts --network avaxMain
```

## Testnet output

```
┌──────────────────────┬──────────────────────────────────────────────┐
│ (index)              │ Values                                       │
├──────────────────────┼──────────────────────────────────────────────┤
│ registrationVerifier │ '0xC13ebB589d15801C5a809227F164E0644706c321' │
│ mintVerifier         │ '0xefE312120Fd2848Bf6957d3887BBf2772481cA45' │
│ withdrawVerifier     │ '0x83A0AEf956cc39ddd86050c590c0897172cd10E8' │
│ transferVerifier     │ '0x612E2F98B013f05Bea5780B969049f81e25Cc811' │
│ babyJubJub           │ '0x70A9439EA3160311Ffd0858e66b45d3c029d9554' │
│ registrar            │ '0xD71976537EfaA72BDe5ee948aF0ABD7289dd7fA0' │
│ encryptedERC         │ '0xD212990E76a290dC0f4e15DF62DEf12d1156f1Db' │
└──────────────────────┴──────────────────────────────────────────────┘
```

## Mainnet output