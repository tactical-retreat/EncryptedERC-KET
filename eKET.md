# eKET

## Solidity changes from vanilla repo

1) Register specific token for converter during creation
2) Disallow arbitrary token registrations
3) Accept name/symbol for converter, since it only supports one token

## Deployment changes

1) Update TypeScript params to match new contract
2) Fork `deploy-converter.ts` to `deploy-eket.ts`
    * Deploy in prod mode
    * Supply KET as a parameter
    * Supply name/symbol
    * Decimals to 18
    * Remove deploying ERC20
    * Add verification support for contracts

## Build system changes
   
One time setup for verification:

```
npm install --save-dev @nomicfoundation/hardhat-verify
```

## (do not) Compile Circuits

There's no need to run the `zkit` commands; the `contracts/prod` directory already has stuff that matches
`circom/build`.

## Deployment setup

New .env file with:

```
PRIVATE_KEY=private_key_without_0x_prefix
SNOWTRACE_API_KEY=your_snowtrace_api_key_here
```

Deployer used for eKET (on testnet and mainnet) is `0x96eaee93BD2c15F1259371BDC3c5EfC559698Ca4`.

Commands:

```
npx hardhat run scripts/deploy-eket.ts --network avaxTest
npx hardhat run scripts/deploy-eket.ts --network avaxMain
```

## Testnet / Mainnet deployments

Using the initial transactions on a fresh key, I deployed the contracts to the same address on both chains (similar
to how $KET is deployed).

```
┌──────────────────────┬──────────────────────────────────────────────┐
│ (index)              │ Values                                       │
├──────────────────────┼──────────────────────────────────────────────┤
│ registrationVerifier │ '0xFd4CEE9aa5826D38070b6308FdfdA557a9a890Aa' │
│ mintVerifier         │ '0xe84a3b2582b915455e754e867F7A44896E7CAAA4' │
│ withdrawVerifier     │ '0x2Aeb195Df149d4514Cc2649a297024685A05a303' │
│ transferVerifier     │ '0x7bBefB9458C88062E9842b818117Da219feAc292' │
│ babyJubJub           │ '0x5a2F86E2B0A52b8C267f6822a17D3EDdD17ef5A3' │
│ registrar            │ '0x7020eE6dab70C6B69788cFb7F83f1b48a0ee7344' │
│ encryptedERC         │ '0xdAA67866a34f5FbB41237D4f83dD75f473963d80' │
└──────────────────────┴──────────────────────────────────────────────┘
```
