import {
    createNft,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { 
    mplToolbox,
} from "@metaplex-foundation/mpl-toolbox";
import {
    keypairIdentity,
    percentAmount,
    generateSigner,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { readFileSync } from "fs";

const umi = createUmi("https://api.mainnet-beta.solana.com")
    .use(mplTokenMetadata())
    .use(mplToolbox());

// Load wallet
const keypairFile = JSON.parse(
    readFileSync(
        "./id.json",
        "utf-8"
    )
);

const wallet = umi.eddsa.createKeypairFromSecretKey(
    Uint8Array.from(keypairFile)
);

// Load the keypair into umi.
umi.use(keypairIdentity(wallet));

// Create NFT and mint it to a specific account
async function createAndMintNFT() {
    try {
        // Replace this with the actual recipient's public key
        const recipientAddress = "7aWYxQwbQnoip5kVrAp1kYF6DiXiiViqfARGjMQvfDZJ"; // e.g., "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
        
        // Generate a new mint keypair
        const nftMint = generateSigner(umi);

        // Create the NFT
        const createTx = await createNft(umi, {
            mint: nftMint,
            sellerFeeBasisPoints: percentAmount(0),
            name: 'To soar into the clouds',
            symbol: "SOAR",
            tokenOwner: recipientAddress,
            uri: "https://teal-defiant-ostrich-778.mypinata.cloud/ipfs/bafkreidlwpaioam2rxfze2fj6tr7gldxr4edlw7l5gsa55zrmdlqxv3fka",
        }).sendAndConfirm(umi);

        console.log("NFT created successfully!");
        console.log("Mint address:", nftMint.publicKey.toString());
    } catch (error) {
        console.error("Error creating/minting NFT:", error);
    }
}

// run the function
createAndMintNFT();