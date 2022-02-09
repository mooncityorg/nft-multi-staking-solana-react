import * as anchor from '@project-serum/anchor';
import {PublicKey} from '@solana/web3.js';

export interface GlobalBarn {
    superAdmin: PublicKey,    // 32
    landStakedCnt: anchor.BN,    // 8
    animStakedCnt: anchor.BN,    // 8
    farmerStakedCnt: anchor.BN,  // 8
}

export interface StakedYard {
    // 376
    // yard can be identified uniquely by the land mint
    landMint: PublicKey,           // 32
    animCnt: anchor.BN,               // 8
    animMints: PublicKey[],     // 32 * 5 = 160
    farmerCnt: anchor.BN,             // 8
    farmerMints: PublicKey[],   // 32 * 5 = 160
    stakeTime: anchor.BN,             // 8
}

export interface UserBarn {
    // 8 + 18_864
    owner: PublicKey,                       // 32
    stakedNftCount: anchor.BN,            // 8
    yardCount: anchor.BN,                  // 8
    yards: StakedYard[],   // 376 * 50 = 18_800
    rewardTime: anchor.BN,                 // 8
    remainRewardAmount: anchor.BN,        // 8
}
