# blockTitle: Combating Inefficiencies in Land Registry in Africa

<!-- TOC -->

- [blockTitle: Combating Inefficiencies in Land Registry in Africa](#blocktitle-combating-inefficiencies-in-land-registry-in-africa)
  - [Summary](#summary)
  - [Background and Motivation](#background-and-motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
  - [Plan](#plan)
    - [Example Workflow](#example-workflow)
    - [Engineering Plan](#engineering-plan)
    - [The Frontend Was Scaffolded With Create React App](#the-frontend-was-scaffolded-with-create-react-app)
      - [Available Scripts](#available-scripts)
        - [yarn start](#yarn-start)
        - [yarn test](#yarn-test)
        - [yarn build](#yarn-build)
        - [yarn eject](#yarn-eject)
        - [Advanced Configuration](#advanced-configuration)
        - [Deployment](#deployment)
        - [yarn build fails to minify](#yarn-build-fails-to-minify)
  - [Measuring Impact](#measuring-impact)
  - [Security, Privacy, and Risks](#security-privacy-and-risks)
  - [Other Considerations](#other-considerations)
  - [Milestones](#milestones)
  - [Open Questions](#open-questions)

<!-- /TOC -->

## Summary

`blockTitle` is a dApp to register land titles in African nations via private blockchains.

@author: Sandra Abago

@license: MIT License

## Background and Motivation

<p>When a potential land owner seeks to buy property in Africa today, they must find and secure the title, and have the lawful owner of the land sign it over. Behind each of these transactions is a land registry paper trail that varies vastly in both qualitative and quantitative measures.</p>

<p>In principle, land registries simply need to maintain records on land ownership, recording changes of hands as they happen over the years. This seems simple but it comes with a myriad of challenges. Usually, land registries are based on paper documents, which can be lost, destroyed, falsified, or otherwise manipulated. If any of the mentioned events happened, the process to properly document the land can become highly arduous. Currently, there is no way to quickly verify the seller’s claim of ownership, without the relevant approval processes and paperwork.</p>

<p>As recently as 2004, only 1% of land in sub saharan Africa was under formal government registration (https://www.irbnet.de/daten/iconda/CIB20132.pdf). A 2018 study(https://www.researchgate.net/publication/326010732_Challenges_to_Land_Registration_in_Kaduna_State_Nigeria) into the challenges of land registration in a Nigerian state found that only 11% of real estate consultant respondents stated that they always registered residential land purchases. The study also revealed that corruption was rife, along with an inefficient process for land registration evidenced by poor record-keeping, cumbersome processes, and lengthy delays. Unfortunately, many African nations are in a similar position.</p>

<p>Blockchain technology provides a potential solution for many of the challenges of land registration. In a peer-to-peer distributed blockchain-based ledger, such as one used in this project, records are time-stamped, as are subsequent changes to those records. This will allow all involved parties to verify the dates of the past transactions using their smartphones. In addition to quick verifications and hassle-free end-user validations, the proposed dApp brings security to land title transactions because there is no central point of failure and the transactions cannot be changed once they are made. Blockchain technology, therefore, provides a highly secure record of ownership that cannot be manipulated. And since it is decentralized, it allows the “documents” to survive any disaster.</p>

<p>Disclaimer: This idea is not novel, per se. In April of 2018, the Georgian Government launched a project to register land titles via a private blockchain, making it the first national government to use blockchain to secure and validate official actions. By 2020, over 300,000 land titles had already been registered. The sale process now takes minutes, rather than days, with operational cost reductions of up to 90%.</p>

## Goals

Main Goal: Make the governance of land registration in Africa the simplest, most corrupt free and as secure as possible.

- Create an interactive UI for any user to enter the information from their land title.
- Create an interactive UI for government land registry employees to validate the use information and verify ownership.
- Tokenize the access rights to allow for shared ownership.
- Register new land titles on the blockchain.
- Register existing land titles on the blockchain.
- Facilitate smooth and legitimate transfers of land ownership rights.

## Non-Goals

- To replace the government concerning how land is registered and monitored.
- Digitizing purchase and sale of land titles.
- Building the private blockchain(s).
- Accommodating for mortgages and rent.
- Voting system(s) to let multiple owners determine what is to be done with the property, eg in the event of death.

## Plan

<p>For this project, blockTitle (Version 1) is a dApp that is powered by Solidity Smart Contracts on the Rikenby Ethereum testnet (building a private block chain is OOS for this project) in the backend. The dApp has an interactive web interface built using ReactJs; which communicates to the smart contracts via the web3.JS API interface.</p>

<p>In blockTitle, the details of the land exchange transactions are placed on a (private) blockchain network run by known computers (potentially owned by the government that is utilizing the dApp). That data is then turned into a cryptographic hash, made public on the block chain. The hash is a type of digital fingerprint that enables anyone to verify that the data matches what is on the blockchain without having to see the data. The hash is then embedded in a Quick Recovery (QR) code that is assigned to the owner’s user account.  If changes such as size, or ownership are made, they are added to the blockchain. And if the property is sold, all the past transactions are transferred to the new owner via a newly computed hash. Every transaction is traceable, timestamped, and indisputable. The owner can use the QR for easy validation and/or verification via their smartphone.
In addition, this dApp implements end-to-end encryption of sensitive data and tokenizes the access rights. The access token is attached to the land registry, and the owner controls grant access to authorized parties. This approach of tokenization allows for fractional or co-ownership of the land.</p>

### Example Workflow

1. User (citizen) enters the information from their righfully owned land title via the general UI.
2. An authorized user (a land registry employee) validates athe information and verifies ownership as per the state's records, via a special UI (with login).
3. The authorized user submits the bonafide information to the smart contract, and this triggers two events:

   - Creation of a wallet with a public and private keys for the bonafide owner.
   - Hashing of the bonafide information

4. After the event for hashing the bonafide information is received, the access token is created; the hash, as well as access token are sent to a miner, a block is mined, and the validated transaction hash is broadcast to the (private) blockchain.
5. The validated hash is also sent to the QR generation location.
6. After the QR is generated, it is added to the user's wallet (that was created in step 3, along with the access token.
7. The user can now use the QR code to show interested parties that they are the bonafide owners of the land, and use the access token for sharing governance of the land title.

### Engineering Plan

<p>The dApp's backend runs on Solidity Smart Contracts that are tested and deployed using the Truffle suite. The Infura gateway is used as an Ethereum Network Gateway Servive.</p>

<p>For local development, Truffle is connected to the Ganache local Testnet via `Port 8454`. Gananche is imported into Metamask; an Ethereum wallet that is used to inject web3 objects into the borwser, and facilitates signing of transactions. The project will eventually be deployed on the Rinkeby testnet. And audited with `...`. </p>

### The Frontend Was Scaffolded With Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Available Scripts

In the project directory, you can run:

##### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

##### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

##### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

##### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

##### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

##### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

##### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Measuring Impact

- Digitize 25% of all land titles in a state in a span of a year.
- Decrease time and resources spent validating and verifying land titles by 90%.
- 100% secure land rights.
- Completely eliminate falsification or duplication of land titles.

## Security, Privacy, and Risks

- The fact that the dApp requires a government official to validate the entered data against the land registry's database could present a privacy and security risk since it means that the dApp is potentially not as decentralized.

## Other Considerations

- It was considered to validate the information entered by the user via the blockchain, but not only would this make using the dApp more expensive, it would also increase the dApp's vulnerability to external attacks since an external (land registry) database would have to be accessed by the smart contract via an API to achieve validation of user entered information.
- The approach of embedding the QR code on the corresponding land titles was also considered, but it was decided that that would require additional resources, as compared to accessing the QR code via a smartphone.

## Milestones

- Oct 23rd - Nov 7th 2021: Build, test, and deploy smart contracts
- Nov 8th - Nov 21st 2021: Build and test the frontend.
- Nov 22nd - Nov 30th 2021: Audit and Deploy.

## Open Questions

Should this project accommodate for property rights? Ie should the dApp also register who owns the property located on the land referred to by the land title?
