#!/bin/bash
set -e

echo "🔧 Building Role Proof Circuit..."

# ✅ Create build output directory
mkdir -p circuits/build

# ✅ Compile the circuit (this was failing)
circom circuits/roleProof.circom --r1cs --wasm --sym -o circuits/build

cd circuits

# ✅ Download Powers of Tau (if not already downloaded)
if [ ! -f "powersOfTau28_hez_final_10.ptau" ]; then
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

# ✅ Generate proving key
snarkjs groth16 setup build/roleProof.r1cs powersOfTau28_hez_final_10.ptau roleProof_0000.zkey

# ✅ Contribute to the ceremony
snarkjs zkey contribute roleProof_0000.zkey roleProof_final.zkey --name="Local Contribution" -v -e="zk-role"

# ✅ Export verification key
snarkjs zkey export verificationkey roleProof_final.zkey verification_key.json

# ✅ Copy to frontend/public
mkdir -p ../public/circuits
cp build/roleProof_js/roleProof.wasm ../public/circuits/
cp roleProof_final.zkey ../public/circuits/
cp verification_key.json ../public/circuits/

echo "✅ Build Complete: All artifacts in public/circuits/"
