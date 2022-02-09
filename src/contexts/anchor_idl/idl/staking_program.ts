export type StakingProgram = {
  "version": "0.1.0",
  "name": "staking_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeBarn",
      "accounts": [
        {
          "name": "userBarn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "initYarnStaking",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userBarn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "nftCount",
          "type": "u8"
        },
        {
          "name": "nftMints",
          "type": {
            "array": [
              "publicKey",
              7
            ]
          }
        },
        {
          "name": "nftTypes",
          "type": {
            "array": [
              "u8",
              7
            ]
          }
        }
      ]
    },
    {
      "name": "withdrawStakedYard",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userBarn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "nftCount",
          "type": "u8"
        },
        {
          "name": "nftMints",
          "type": {
            "array": [
              "publicKey",
              7
            ]
          }
        },
        {
          "name": "nftTypes",
          "type": {
            "array": [
              "u8",
              7
            ]
          }
        }
      ]
    },
    {
      "name": "claimReward",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userBarn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "GlobalBarn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superAdmin",
            "type": "publicKey"
          },
          {
            "name": "landStakedCnt",
            "type": "u64"
          },
          {
            "name": "animStakedCnt",
            "type": "u64"
          },
          {
            "name": "farmerStakedCnt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UserBarn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "stakedNftCount",
            "type": "u64"
          },
          {
            "name": "yardCount",
            "type": "u64"
          },
          {
            "name": "yards",
            "type": {
              "array": [
                {
                  "defined": "StakedYard"
                },
                50
              ]
            }
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "remainRewardAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakedYard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "landMint",
            "type": "publicKey"
          },
          {
            "name": "animCnt",
            "type": "u64"
          },
          {
            "name": "animMints",
            "type": {
              "array": [
                "publicKey",
                5
              ]
            }
          },
          {
            "name": "farmerCnt",
            "type": "u64"
          },
          {
            "name": "farmerMints",
            "type": {
              "array": [
                "publicKey",
                5
              ]
            }
          },
          {
            "name": "stakeTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Uninitialized",
      "msg": "Uninitialized account"
    },
    {
      "code": 6001,
      "name": "InvalidUserBarn",
      "msg": "Invalid User Barn"
    },
    {
      "code": 6002,
      "name": "InvalidBarnError",
      "msg": "Invalid barn number"
    },
    {
      "code": 6003,
      "name": "InvalidNFTAddress",
      "msg": "No Matching NFT to withdraw"
    },
    {
      "code": 6004,
      "name": "UnkownNftType",
      "msg": "Unkown Nft type is supplied"
    },
    {
      "code": 6005,
      "name": "InvalidOwner",
      "msg": "NFT Owner key mismatch"
    },
    {
      "code": 6006,
      "name": "InvalidWithdrawTime",
      "msg": "Staking Locked Now"
    },
    {
      "code": 6007,
      "name": "IndexOverflow",
      "msg": "Withdraw NFT Index OverFlow"
    },
    {
      "code": 6008,
      "name": "AllNFTsAlreadyStaked",
      "msg": "All NFTs already staked for last yard"
    },
    {
      "code": 6009,
      "name": "NoYardCreatedYet",
      "msg": "No yard is created for staking NFTs"
    },
    {
      "code": 6010,
      "name": "OverMaxYardStaking",
      "msg": "Max yard count is over for staking NFTs"
    },
    {
      "code": 6011,
      "name": "OverMaxAnimalNFTStaking",
      "msg": "All Animal NFTs already staked for last yard"
    },
    {
      "code": 6012,
      "name": "OverMaxFarmerNFTStaking",
      "msg": "All Farmer NFTs already staked for last yard"
    },
    {
      "code": 6013,
      "name": "InsufficientRewardVault",
      "msg": "Insufficient Reward token balance"
    },
    {
      "code": 6014,
      "name": "TokenTransferFailed",
      "msg": "Cpi spl token transfer failed"
    },
    {
      "code": 6015,
      "name": "InvalidNftsCount",
      "msg": "Nfts count should be between 3 to 11"
    },
    {
      "code": 6016,
      "name": "InvalidTokenAccountPassing",
      "msg": "Passed token account is mismatching with NFT mints"
    }
  ],
  "metadata": {
    "address": "2nzuuPMGzrwtzXXU6PXP3dcTj24gJKS6uG8AsCuSs2mf"
  }
};

export const IDL = {
  "version": "0.1.0",
  "name": "staking_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeBarn",
      "accounts": [
        {
          "name": "userBarn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "initYarnStaking",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userBarn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "nftCount",
          "type": "u8"
        },
        {
          "name": "nftMints",
          "type": {
            "array": [
              "publicKey",
              7
            ]
          }
        },
        {
          "name": "nftTypes",
          "type": {
            "array": [
              "u8",
              7
            ]
          }
        }
      ]
    },
    {
      "name": "withdrawStakedYard",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userBarn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "nftCount",
          "type": "u8"
        },
        {
          "name": "nftMints",
          "type": {
            "array": [
              "publicKey",
              7
            ]
          }
        },
        {
          "name": "nftTypes",
          "type": {
            "array": [
              "u8",
              7
            ]
          }
        }
      ]
    },
    {
      "name": "claimReward",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userBarn",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "GlobalBarn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superAdmin",
            "type": "publicKey"
          },
          {
            "name": "landStakedCnt",
            "type": "u64"
          },
          {
            "name": "animStakedCnt",
            "type": "u64"
          },
          {
            "name": "farmerStakedCnt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UserBarn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "stakedNftCount",
            "type": "u64"
          },
          {
            "name": "yardCount",
            "type": "u64"
          },
          {
            "name": "yards",
            "type": {
              "array": [
                {
                  "defined": "StakedYard"
                },
                50
              ]
            }
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "remainRewardAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakedYard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "landMint",
            "type": "publicKey"
          },
          {
            "name": "animCnt",
            "type": "u64"
          },
          {
            "name": "animMints",
            "type": {
              "array": [
                "publicKey",
                5
              ]
            }
          },
          {
            "name": "farmerCnt",
            "type": "u64"
          },
          {
            "name": "farmerMints",
            "type": {
              "array": [
                "publicKey",
                5
              ]
            }
          },
          {
            "name": "stakeTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Uninitialized",
      "msg": "Uninitialized account"
    },
    {
      "code": 6001,
      "name": "InvalidUserBarn",
      "msg": "Invalid User Barn"
    },
    {
      "code": 6002,
      "name": "InvalidBarnError",
      "msg": "Invalid barn number"
    },
    {
      "code": 6003,
      "name": "InvalidNFTAddress",
      "msg": "No Matching NFT to withdraw"
    },
    {
      "code": 6004,
      "name": "UnkownNftType",
      "msg": "Unkown Nft type is supplied"
    },
    {
      "code": 6005,
      "name": "InvalidOwner",
      "msg": "NFT Owner key mismatch"
    },
    {
      "code": 6006,
      "name": "InvalidWithdrawTime",
      "msg": "Staking Locked Now"
    },
    {
      "code": 6007,
      "name": "IndexOverflow",
      "msg": "Withdraw NFT Index OverFlow"
    },
    {
      "code": 6008,
      "name": "AllNFTsAlreadyStaked",
      "msg": "All NFTs already staked for last yard"
    },
    {
      "code": 6009,
      "name": "NoYardCreatedYet",
      "msg": "No yard is created for staking NFTs"
    },
    {
      "code": 6010,
      "name": "OverMaxYardStaking",
      "msg": "Max yard count is over for staking NFTs"
    },
    {
      "code": 6011,
      "name": "OverMaxAnimalNFTStaking",
      "msg": "All Animal NFTs already staked for last yard"
    },
    {
      "code": 6012,
      "name": "OverMaxFarmerNFTStaking",
      "msg": "All Farmer NFTs already staked for last yard"
    },
    {
      "code": 6013,
      "name": "InsufficientRewardVault",
      "msg": "Insufficient Reward token balance"
    },
    {
      "code": 6014,
      "name": "TokenTransferFailed",
      "msg": "Cpi spl token transfer failed"
    },
    {
      "code": 6015,
      "name": "InvalidNftsCount",
      "msg": "Nfts count should be between 3 to 11"
    },
    {
      "code": 6016,
      "name": "InvalidTokenAccountPassing",
      "msg": "Passed token account is mismatching with NFT mints"
    }
  ],
  "metadata": {
    "address": "2nzuuPMGzrwtzXXU6PXP3dcTj24gJKS6uG8AsCuSs2mf"
  }
};
