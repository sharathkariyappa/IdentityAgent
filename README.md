# React + TypeScript + Vite

# Identity Agent

This project is a decentralized identity agent model that classifies a user’s role as a **Founder**, **Investor**, or **Contributor** using both on-chain and off-chain data. The classification is powered by a machine learning model, and the identity claim is verified using a Zero-Knowledge Proof (ZKP) mechanism. The idea is to let users prove their identity privately and securely, without revealing underlying data.

The system is built using a modern tech stack:

- **Frontend**: Vite + React + TypeScript
- **AI/ML Model**: Python (deployed via Flask)
- **Backend**: Node.js + Express, with ZK proof generation using Circom and SnarkJS
- **Blockchain Integration**: On-chain activity is pulled using ether.js/Infura/Alchemy/
- **Identity**: ethrDID, 

To get started with the frontend:

1. Clone the repository.
2. Navigate to the frontend folder.
3. Run `npm install` to install dependencies.
4. Create a `.env` file in the `client` directory with the following variables:

VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_CERAMIC_KEY=your_ceramic_key
VITE_GITHUB_SECRET_KEY=your_github_secret_key

5. Start the development server using `npm run dev`.

To set up the backend:
1. Clone the repository.
2. Navigate to the backend folder.
3. Run `npm install` to install backend dependencies.
4. Create a `.env` file in the `Backend` directory with the following values:

# The Backend is already Live, u can just use this Endpoints to get the benefits

# To get the onchain data.:    https://identitybackend.onrender.com/api/onchain-stats?address=${walletAddress}

INFURA_KEY=your_infura_project_id
ALCHEMY_KEY=your_alchemy_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_SECRET_KEY=your_github_secret_key

5. Start the backend server with `node index.js`.

The machine learning model is used to predict the user's role based on GitHub and blockchain metrics. It is developed in Python and deployed using Flask. To run the ML service:
# ML model is also Live, u can use this to get the results.

# get role and scores,: https://mlflaskmodel.onrender.com/predict

It takes the payload like this.
  {
    totalContributions,
    pullRequests,
    issues,
    repositoriesContributedTo,
    followers,
    repositories,
    ethBalance,
    txCount,
    isContractDeployer,
    contractDeployments,
    tokenBalances,
    nftCount,
    daoVotes,
    hasNFTs
  };

For Zero-Knowledge Proofs, Circom circuits are compiled and verified using SnarkJS. Here's how to set up ZK locally:

1. Navigate to the `circuits` directory.
2. Compile the circuit: `circom role_classifier.circom --r1cs --wasm --sym`.

3. Run the trusted setup: `snarkjs groth16 setup role_classifier.r1cs pot12_final.ptau circuit_final.zkey`.

4. Export the verification key: `snarkjs zkey export verificationkey circuit_final.zkey verification_key.json`.

5. Witness generation and proof creation are handled automatically in the backend.

The ML model takes data like GitHub contributions (PRs, issues, commits) and on-chain metrics to generate a role classification score. This score is used as input to the ZK circuit which then outputs a valid proof without revealing the score itself. This allows verification of someone's role without leaking any raw data.

Environment variables used throughout the project include:
- `INFURA_KEY`, `ALCHEMY_KEY` for blockchain access
- `GITHUB_CLIENT_ID`, `GITHUB_SECRET_KEY` for GitHub OAuth
- `CERAMIC_KEY` for DID operations

Future improvements planned include:

- Integration of AI chatbot to get the suggestions to improve the stats.
- On-chain verifier contract for ZK proof validation
- UI visualizations of scores and activity
- zkSync/Polygon support

You’re welcome to contribute — open issues, suggest features, or create pull requests.

License: MIT

Built with privacy in mind — because **who you are** shouldn't require revealing everything you’ve done.

Made with ❤️ by Sharath

