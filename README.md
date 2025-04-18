# Blockchain-Based Land Registration System

_Link To The Presentation:_ [Project Presentation](./FITE2010%20Final%20Presentation.pdf) <br>
_Link To Video Demonstration:_ [Video Demo](https://youtu.be/iBzmwk8mjUI?si=LXiNYXPRH0n6XtHg) <br>

## Contributors

Author: Masood Ahmed <br>
Email: masood20@connect.hku.hk <br>

Author: Mohammad Abdur Rahman <br>
Email: abdur8606@gmail.com <br>


## Project Overview

This project implements a blockchain-based land registration system using Ethereum smart contracts. It features three distinct user interfaces tailored for different stakeholders in the property market:

- **Buyer Dashboard:** Allows potential buyers to view and select available lands for purchase.
- **Seller Dashboard:** Enables sellers to list and manage lands they are willing to sell.
- **Land Inspector Dashboard:** Provides a platform for land inspectors (government entities) to verify and authorize land sales.

## Project Setup

This section provides detailed instructions for setting up the project environment and launching the application.

### Initial Setup

Follow these steps to install the necessary software:

1. **Install Node.js and npm:**
   - Visit the [Node.js official website](https://nodejs.org/) and download the installer for your operating system. This will install both Node.js and npm (Node Package Manager).

2. **Install Truffle:**
   - Truffle is a development environment, testing framework, and asset pipeline for Ethereum. Install it globally using npm:
     ```
     npm install -g truffle
     ```

3. **Install Ganache:**
   - Ganache is a personal blockchain for Ethereum development used to deploy contracts, develop applications, and run tests. It is available as both a desktop application and a command-line tool (ganache-cli). Download the desktop app from the [Truffle Suite website](https://www.trufflesuite.com/ganache) or install the CLI using npm:
     ```
     npm install -g ganache-cli
     ```

### Front-end Application Setup

1. **Navigate to the Project Directory:**
   - Open a terminal and navigate to the root directory of the project, where the `package.json` file is located.

2. **Install Dependencies:**
   - Run the following command to install all the necessary dependencies for the React application:
     ```
     npm install
     ```

### Smart Contract Setup

1. **Start Ganache:**
   - Open the Ganache application or start `ganache-cli` in a terminal to begin running a local blockchain.

2. **Compile Smart Contracts:**
   - Navigate to the `/web3` directory
   - Compile the smart contract to check for any errors and build the necessary artifacts for deployment. In your terminal, run:
     ```
     truffle compile
     
     // if the above doesn't work for you, use:
     // npx truffle compile
     ```

3. **Migrate Smart Contracts:**
   - Deploy your smart contracts to the local blockchain using Truffle. This will execute the migration scripts specified in the `migrations` directory.
     ```
     truffle migrate
     
     // if the above doesn't work for you, use:
     // npx truffle migrate
     ```

### Configuring the React Application

Our React application needs to communicate with the smart contracts on the blockchain, so let's set that up:

1. **Update Contract Artifacts:**
   - After migrations, Truffle will create JSON artifact files in the `/web3/build/contracts` directory, named `Land.json`. Copy this file and paste/replace it in the `/src/artifacts` directory.

   <em>Note: If </em>`/src/artifacts` <em> doesn't exist in the project, create one directory named</em> `artifacts`<em> inside the `/src` directory.</em>

   - Our React app uses this to interact with the contracts, so ensure they are up to date after any changes to the contracts.

2. **Connect to the Local Blockchain:**
   - In the React app's code where the web3 instance is created, ensure it's set to connect to Ganache's local blockchain, usually at `http://localhost:7545`. 
   - Check the `truffle-config.js` file inside the `/web3` directory, and update the following according to your Ganache's configurations:
     ```
     development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)},
     ```

3. **Check Environment Variables:**
   - If there are any environment variables (like contract addresses or API keys), make sure they are correctly set in your `.env` file at the root of the project.

### Important Note

**Bug Alert:** Please ensure to reload every page once you are routed to it in order to load all the necessary web3 information. Failing to do so may result in the application not functioning properly.

### Launching the Application

With all the configuration done, we're ready to start the application!

1. **Run the React App:**
   - In the terminal, still at the root of the project, execute:
     ```
     npm start
     ```
   - This command fires up the React development server and should automatically open the application in your default web browser.

2. **Interact with the Application:**
   - You can now interact with the application and the smart contracts. Since we're using a local blockchain, there's no real money involved, making it safe to test out every feature.


## Feedback

Pull requests are welcome. For feedback and suggestions, please reach out at the following email: mangimasood2000@gmail.com or abdur8606@gmail.com. 

## License

2024 © The University of Hong Kong

### _Stay Happy and Keep Smiling :)_
