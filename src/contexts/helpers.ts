
import { web3 } from '@project-serum/anchor';
import {
  AccountInfo,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as anchor from '@project-serum/anchor';
import { showToast } from './utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import IDL from './anchor_idl/idl/staking_program.json';
import { GlobalBarn, UserBarn } from './types';
import { programs } from '@metaplex/js';
import { ANIMAL_CREATOR, FARMER_CREATOR, LAND_CREATOR } from '../config';
import { errorAlert, successAlert } from '../components/toastGroup';

export const solConnection = new web3.Connection(web3.clusterApiUrl("devnet"));

const ASSOCIATED_TOKEN_PROGRAM_ID: PublicKey = new PublicKey(
  '',
);
const REWARD_TOKEN_MINT = new PublicKey("");
const PROGRAM_ID = "";
const GLOBAL_AUTHORITY_SEED = "global-authority";
const USER_BARN_SEED = 'user-barn';
const USER_BARN_SIZE = 8 + 18_864;

export const getNftMetaData = async (nftMintPk: PublicKey) => {
  let { metadata: { Metadata } } = programs;
  let metadataAccount = await Metadata.getPDA(nftMintPk);
  const metadat = await Metadata.load(solConnection, metadataAccount);
  return metadat;
}

export const bcbyValidate = (mintAddress: string) => {
  if (mintAddress === LAND_CREATOR) {
    return 1
  } else if (mintAddress === FARMER_CREATOR) {
    return 2
  } else if (mintAddress === ANIMAL_CREATOR) {
    return 3
  } else {
    return 0
  }
}
export const initProject = async (
  wallet: WalletContextState
) => {
  if (!wallet.publicKey) return;
  let cloneWindow: any = window;

  let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
  const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  const rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);
  const tx = await program.rpc.initialize(bump, {
    accounts: {
      admin: wallet.publicKey,
      globalAuthority,
      rewardVault,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    },
    signers: [],
  });
  await solConnection.confirmTransaction(tx, "confirmed");
  await new Promise((resolve, reject) => {
    solConnection.onAccountChange(globalAuthority, (data: AccountInfo<Buffer> | null) => {
      if (!data) reject();
      resolve(true);
    });
  });

  showToast("Success. txHash=" + tx, 0);
  return false;
}

export const getUserBarnState = async (
  userAddress: PublicKey
): Promise<UserBarn | null> => {
  if (!userAddress) return null;
  let cloneWindow: any = window;
  let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
  const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

  let userBarnKey = await PublicKey.createWithSeed(
    userAddress,
    "user-barn",
    program.programId,
  );
  try {
    let barnState = await program.account.userBarn.fetch(userBarnKey);
    return barnState as UserBarn;
  } catch {
    return null;
  }
}

export const getGlobalState = async (
): Promise<GlobalBarn | null> => {
  let cloneWindow: any = window;
  let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
  const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
  const [globalAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );
  try {
    let globalState = await program.account.globalBarn.fetch(globalAuthority);
    return globalState as GlobalBarn;
  } catch {
    return null;
  }
}

export const stakeToYard = async (
  wallet: WalletContextState,
  land_mint: string,
  anim_mints: string[],
  farmer_mints: string[],
) => {
  if (!wallet.publicKey || land_mint === "" || anim_mints.length === 0 || farmer_mints.length === 0) return;

  try {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const land_nft_mint = new PublicKey(land_mint);
    const anim_nft_mints = anim_mints.map((mint) => new PublicKey(mint));
    const farmer_nft_mints = farmer_mints.map((mint) => new PublicKey(mint));

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );
    let userBarnKey = await PublicKey.createWithSeed(
      wallet.publicKey,
      USER_BARN_SEED,
      program.programId,
    );
    let tx = new Transaction();

    let barnAccount = await solConnection.getAccountInfo(userBarnKey);
    if (barnAccount === null || barnAccount.data === null) {
      tx.add(SystemProgram.createAccountWithSeed({
        fromPubkey: wallet.publicKey,
        basePubkey: wallet.publicKey,
        seed: USER_BARN_SEED,
        newAccountPubkey: userBarnKey,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(USER_BARN_SIZE),
        space: USER_BARN_SIZE,
        programId: program.programId,
      }));
      tx.add(program.instruction.initializeBarn(
        {
          accounts: {
            userBarn: userBarnKey,
            owner: wallet.publicKey
          }
        }
      ))
    }

    let userLandTokenAccount = await getAssociatedTokenAccount(wallet.publicKey, land_nft_mint);
    let userAnimTokenAccounts: PublicKey[] = [];
    let userFarmerTokenAccounts: PublicKey[] = [];
    for (let mint of anim_nft_mints) {
      const acc = await getAssociatedTokenAccount(wallet.publicKey as PublicKey, mint);
      userAnimTokenAccounts.push(acc);
    };
    for (let mint of farmer_nft_mints) {
      const acc = await getAssociatedTokenAccount(wallet.publicKey as PublicKey, mint);
      userFarmerTokenAccounts.push(acc);
    };
    let remainingAccounts = [], destNftTokenAccounts = [];
    let ret = await getATokenAccountsNeedCreate(
      solConnection,
      wallet.publicKey,
      globalAuthority,
      [land_nft_mint, ...anim_nft_mints, ...farmer_nft_mints]
    );

    if (ret.instructions.length > 0) {
      tx.add(...ret.instructions);
    }
    destNftTokenAccounts.push(...ret.destinationAccounts);

    let idx = 0, nft_mints: anchor.web3.PublicKey[] = [], nft_types: number[] = [];
    for (let i = 0; i < 7; i++) {
      nft_mints.push(SystemProgram.programId);
      nft_types.push(0);    // land_nft
    }

    nft_mints[idx] = land_nft_mint;
    nft_types[idx] = 0;     // land_nft
    remainingAccounts.push({
      pubkey: userLandTokenAccount,
      isWritable: true,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: destNftTokenAccounts[idx++],
      isWritable: true,
      isSigner: false,
    });

    for (let i in anim_nft_mints) {
      nft_mints[idx] = anim_nft_mints[i];
      nft_types[idx] = 1;     // anim_nft
      remainingAccounts.push({
        pubkey: userAnimTokenAccounts[i],
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: destNftTokenAccounts[idx++],
        isWritable: true,
        isSigner: false,
      });
    }

    for (let i in farmer_nft_mints) {
      nft_mints[idx] = farmer_nft_mints[i];
      nft_types[idx] = 2;     // farmer_nft
      remainingAccounts.push({
        pubkey: userFarmerTokenAccounts[i],
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: destNftTokenAccounts[idx++],
        isWritable: true,
        isSigner: false,
      });
    }

    tx.add(program.instruction.initYarnStaking(
      bump, 1 + anim_mints.length + farmer_mints.length, nft_mints, nft_types, {
      accounts: {
        owner: wallet.publicKey,
        userBarn: userBarnKey,
        globalAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        // systemProgram: SystemProgram.programId,
        // rent: SYSVAR_RENT_PUBKEY
      },
      remainingAccounts,
    }
    ));
    let txHash = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txHash, "confirmed");
    await new Promise((resolve, reject) => {
      solConnection.onAccountChange(userBarnKey, (data: AccountInfo<Buffer> | null) => {
        if (!data) reject();
        resolve(true);
      });
    });
    successAlert("Success. txHash=" + txHash);
  } catch (e) {
    errorAlert("Error =" + e);
  }
}

export const withdrawFromYard = async (
  wallet: WalletContextState,
  land_mint: string,
  anim_mints: string[],
  farmer_mints: string[],
  setUnstakeLoading: Function
) => {
  setUnstakeLoading(true);
  if (!wallet.publicKey || land_mint === "" || anim_mints.length === 0 || farmer_mints.length === 0) return;

  try {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const land_nft_mint = new PublicKey(land_mint);
    const anim_nft_mints = anim_mints.map((mint) => new PublicKey(mint));
    const farmer_nft_mints = farmer_mints.map((mint) => new PublicKey(mint));

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );
    let userBarnKey = await PublicKey.createWithSeed(
      wallet.publicKey,
      USER_BARN_SEED,
      program.programId,
    );

    let tx = new Transaction();

    let userLandTokenAccount = await getAssociatedTokenAccount(wallet.publicKey, land_nft_mint);
    let userAnimTokenAccounts: PublicKey[] = [];
    let userFarmerTokenAccounts: PublicKey[] = [];
    for (let mint of anim_nft_mints) {
      const acc = await getAssociatedTokenAccount(wallet.publicKey as PublicKey, mint);
      userAnimTokenAccounts.push(acc);
    };
    for (let mint of farmer_nft_mints) {
      const acc = await getAssociatedTokenAccount(wallet.publicKey as PublicKey, mint);
      userFarmerTokenAccounts.push(acc);
    };

    let remainingAccounts = [], destNftTokenAccounts = [];
    let ret = await getATokenAccountsNeedCreate(
      solConnection,
      wallet.publicKey,
      globalAuthority,
      [land_nft_mint, ...anim_nft_mints, ...farmer_nft_mints]
    );

    destNftTokenAccounts.push(...ret.destinationAccounts);

    let idx = 0, nft_mints: anchor.web3.PublicKey[] = [], nft_types: number[] = [];
    for (let i = 0; i < 7; i++) {
      nft_mints.push(SystemProgram.programId);
      nft_types.push(0);    // land_nft
    }

    nft_mints[idx] = land_nft_mint;
    nft_types[idx] = 0;     // land_nft
    remainingAccounts.push({
      pubkey: userLandTokenAccount,
      isWritable: true,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: destNftTokenAccounts[idx++],
      isWritable: true,
      isSigner: false,
    });

    for (let i in anim_nft_mints) {
      nft_mints[idx] = anim_nft_mints[i];
      nft_types[idx] = 1;     // anim_nft
      remainingAccounts.push({
        pubkey: userAnimTokenAccounts[i],
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: destNftTokenAccounts[idx++],
        isWritable: true,
        isSigner: false,
      });
    }

    for (let i in farmer_nft_mints) {
      nft_mints[idx] = farmer_nft_mints[i];
      nft_types[idx] = 2;     // farmer_nft
      remainingAccounts.push({
        pubkey: userFarmerTokenAccounts[i],
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: destNftTokenAccounts[idx++],
        isWritable: true,
        isSigner: false,
      });
    }

    tx.add(program.instruction.withdrawStakedYard(
      bump, 1 + anim_mints.length + farmer_mints.length, nft_mints, nft_types, {
      accounts: {
        owner: wallet.publicKey,
        userBarn: userBarnKey,
        globalAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        // systemProgram: SystemProgram.programId,
        // rent: SYSVAR_RENT_PUBKEY
      },
      remainingAccounts,
    }
    ));
    let txHash = await wallet.sendTransaction(tx, solConnection);
    await solConnection.confirmTransaction(txHash, "confirmed");
    await new Promise((resolve, reject) => {
      solConnection.onAccountChange(userBarnKey, (data: AccountInfo<Buffer> | null) => {
        if (!data) reject();
        resolve(true);
      });
    });
    setUnstakeLoading(false);
    successAlert("Success. txHash=" + txHash);
  } catch (e) {
    setUnstakeLoading(false);
    errorAlert("Error =" + e);
  }
}

export const claimReward = async (
  wallet: WalletContextState,
  setClaimLoading: Function,
) => {
  if (!wallet.publicKey) return;
  setClaimLoading(true);
  try {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );
    let userBarnKey = await PublicKey.createWithSeed(
      wallet.publicKey,
      USER_BARN_SEED,
      program.programId,
    );

    let instructions = [];
    const rewardVault = await getAssociatedTokenAccount(globalAuthority, REWARD_TOKEN_MINT);
    const userRewardTokenAccount = await getAssociatedTokenAccount(wallet.publicKey, REWARD_TOKEN_MINT);
    const response = await solConnection.getAccountInfo(userRewardTokenAccount);
    if (!response) {
      const createATAIx = createAssociatedTokenAccountInstruction(
        userRewardTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        REWARD_TOKEN_MINT,
      );
      instructions.push(createATAIx);
    }

    const txHash = await program.rpc.claimReward(
      bump, {
      accounts: {
        owner: wallet.publicKey,
        userBarn: userBarnKey,
        globalAuthority,
        rewardVault,
        userRewardAccount: userRewardTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      instructions,
    }
    );

    await solConnection.confirmTransaction(txHash, "confirmed");
    await new Promise((resolve, reject) => {
      solConnection.onAccountChange(userBarnKey, (data: AccountInfo<Buffer> | null) => {
        if (!data) reject();
        resolve(true);
      });
    });
    setClaimLoading(false);
    successAlert("Success. txHash=" + txHash);
    /////////////////////////
    setTimeout(() => {
      window.location.reload()
    }, 5000);
    ///////////////////////
    return false;
  } catch (e) {
    setClaimLoading(false);
    errorAlert("We found the issue, please try again");
  }
}

const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
  let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
    [
      ownerPubkey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintPk.toBuffer(), // mint address
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  ))[0];
  return associatedTokenAccountPubkey;
}

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
}

export const getATokenAccountsNeedCreate = async (
  connection: anchor.web3.Connection,
  walletAddress: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
  nfts: anchor.web3.PublicKey[],
) => {
  let instructions = [], destinationAccounts = [];
  for (const mint of nfts) {
    const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
    const response = await connection.getAccountInfo(destinationPubkey);
    if (!response) {
      const createATAIx = createAssociatedTokenAccountInstruction(
        destinationPubkey,
        walletAddress,
        owner,
        mint,
      );
      instructions.push(createATAIx);
    }
    destinationAccounts.push(destinationPubkey);
  }
  return {
    instructions,
    destinationAccounts,
  };
}
