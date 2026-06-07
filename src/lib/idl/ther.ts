/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ther.json`.
 */
export type Ther = {
  "address": "THERzdqAyNwcnTD8AfKLYYeU8rMrhT6KB9PZgnXh3Ce",
  "metadata": {
    "name": "ther",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Ther — Cross-Launchpad Token Vault Protocol on Solana"
  },
  "instructions": [
    {
      "name": "addRevenueShare",
      "docs": [
        "Add a revenue share recipient. Vault creator only."
      ],
      "discriminator": [
        171,
        61,
        37,
        47,
        162,
        132,
        92,
        63
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault.creator",
                "account": "vault"
              },
              {
                "kind": "account",
                "path": "vault.vault_name",
                "account": "vault"
              }
            ]
          }
        },
        {
          "name": "revenueShare",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  101,
                  110,
                  117,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "recipient"
              }
            ]
          }
        },
        {
          "name": "creatorRevenueShare",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  101,
                  110,
                  117,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "recipient"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "shareBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "claimRevenue",
      "docs": [
        "Claim accumulated revenue. Revenue share recipient only."
      ],
      "discriminator": [
        4,
        22,
        151,
        70,
        183,
        79,
        73,
        189
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault.creator",
                "account": "vault"
              },
              {
                "kind": "account",
                "path": "vault.vault_name",
                "account": "vault"
              }
            ]
          }
        },
        {
          "name": "revenueShare",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  101,
                  110,
                  117,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "recipient"
              }
            ]
          }
        },
        {
          "name": "recipient",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createVault",
      "docs": [
        "Create a new token vault with initial deposits."
      ],
      "discriminator": [
        29,
        237,
        247,
        208,
        193,
        82,
        54,
        135
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "vaultName"
              }
            ]
          }
        },
        {
          "name": "creatorRevenueShare",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  101,
                  110,
                  117,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "platformWallet",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "vaultName",
          "type": "string"
        },
        {
          "name": "lockType",
          "type": {
            "defined": {
              "name": "lockType"
            }
          }
        },
        {
          "name": "lockDurationSeconds",
          "type": "i64"
        },
        {
          "name": "tokenMints",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "depositAmounts",
          "type": {
            "vec": "u64"
          }
        }
      ]
    },
    {
      "name": "depositTokens",
      "docs": [
        "Deposit tokens into a vault. Anyone can call this."
      ],
      "discriminator": [
        176,
        83,
        229,
        18,
        191,
        143,
        176,
        150
      ],
      "accounts": [
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault.creator",
                "account": "vault"
              },
              {
                "kind": "account",
                "path": "vault.vault_name",
                "account": "vault"
              }
            ]
          }
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "extendLock",
      "docs": [
        "Extend the lock duration of a timed vault. Creator only."
      ],
      "discriminator": [
        68,
        151,
        140,
        144,
        139,
        122,
        118,
        170
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault.creator",
                "account": "vault"
              },
              {
                "kind": "account",
                "path": "vault.vault_name",
                "account": "vault"
              }
            ]
          }
        },
        {
          "name": "creator",
          "signer": true,
          "relations": [
            "vault"
          ]
        }
      ],
      "args": [
        {
          "name": "additionalSeconds",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initializePlatform",
      "docs": [
        "Initialize the platform configuration. Can only be called once."
      ],
      "discriminator": [
        119,
        201,
        101,
        45,
        75,
        122,
        89,
        3
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "registerReferral",
      "docs": [
        "Register a referral mapping on-chain."
      ],
      "discriminator": [
        158,
        196,
        134,
        102,
        193,
        102,
        184,
        86
      ],
      "accounts": [
        {
          "name": "referralAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  101,
                  114,
                  114,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "referrer"
        },
        {
          "name": "referrerReferralAccount",
          "docs": [
            "We check the owner and manually deserialize it if it's initialized to extract L2 & L3 referrers."
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "renounceVault",
      "docs": [
        "Permanently renounce a vault — locks tokens forever."
      ],
      "discriminator": [
        38,
        43,
        71,
        192,
        69,
        212,
        217,
        235
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault.creator",
                "account": "vault"
              },
              {
                "kind": "account",
                "path": "vault.vault_name",
                "account": "vault"
              }
            ]
          }
        },
        {
          "name": "creator",
          "signer": true,
          "relations": [
            "vault"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "swap",
      "docs": [
        "Swap tokens 1:1 in a vault."
      ],
      "discriminator": [
        248,
        198,
        158,
        145,
        225,
        117,
        135,
        200
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault.creator",
                "account": "vault"
              },
              {
                "kind": "account",
                "path": "vault.vault_name",
                "account": "vault"
              }
            ]
          }
        },
        {
          "name": "tokenInMint"
        },
        {
          "name": "tokenOutMint"
        },
        {
          "name": "userTokenInAccount",
          "writable": true
        },
        {
          "name": "userTokenOutAccount",
          "writable": true
        },
        {
          "name": "vaultTokenInAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenInMint"
              }
            ]
          }
        },
        {
          "name": "vaultTokenOutAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenOutMint"
              }
            ]
          }
        },
        {
          "name": "platformWallet",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePlatform",
      "docs": [
        "Update platform configuration. Authority only."
      ],
      "discriminator": [
        46,
        78,
        138,
        189,
        47,
        163,
        120,
        85
      ],
      "accounts": [
        {
          "name": "platformConfig",
          "docs": [
            "Seeds are validated by the constraint."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  116,
                  102,
                  111,
                  114,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "platformWallet",
          "type": "pubkey"
        },
        {
          "name": "creationFee",
          "type": "u64"
        },
        {
          "name": "swapFee",
          "type": "u64"
        },
        {
          "name": "platformFee",
          "type": "u64"
        },
        {
          "name": "creatorFee",
          "type": "u64"
        },
        {
          "name": "minimumDepositBps",
          "type": "u16"
        },
        {
          "name": "referralFee",
          "type": "u64"
        },
        {
          "name": "referralL1Bps",
          "type": "u16"
        },
        {
          "name": "referralL2Bps",
          "type": "u16"
        },
        {
          "name": "referralL3Bps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "docs": [
        "Withdraw tokens from vault. Creator only, after lock expires."
      ],
      "discriminator": [
        2,
        4,
        225,
        61,
        19,
        182,
        106,
        170
      ],
      "accounts": [
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault.creator",
                "account": "vault"
              },
              {
                "kind": "account",
                "path": "vault.vault_name",
                "account": "vault"
              }
            ]
          }
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "creatorTokenAccount",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "platformConfig",
      "discriminator": [
        160,
        78,
        128,
        0,
        248,
        83,
        230,
        160
      ]
    },
    {
      "name": "referralAccount",
      "discriminator": [
        237,
        162,
        80,
        78,
        196,
        233,
        91,
        2
      ]
    },
    {
      "name": "revenueShare",
      "discriminator": [
        55,
        40,
        228,
        7,
        139,
        52,
        180,
        110
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "minimumTwoTokensRequired",
      "msg": "Vault must have minimum 2 tokens"
    },
    {
      "code": 6001,
      "name": "mintAuthorityNotRevoked",
      "msg": "Token mint authority must be revoked"
    },
    {
      "code": 6002,
      "name": "freezeAuthorityNotRevoked",
      "msg": "Token freeze authority must be revoked"
    },
    {
      "code": 6003,
      "name": "lockDurationTooShort",
      "msg": "Lock duration must be at least 1 day"
    },
    {
      "code": 6004,
      "name": "tokenNotInVault",
      "msg": "Token is not registered in this vault"
    },
    {
      "code": 6005,
      "name": "notVaultCreator",
      "msg": "Signer is not the vault creator"
    },
    {
      "code": 6006,
      "name": "insufficientUnallocatedBps",
      "msg": "Insufficient unallocated basis points"
    },
    {
      "code": 6007,
      "name": "recipientAlreadyExists",
      "msg": "Recipient already has a revenue share account"
    },
    {
      "code": 6008,
      "name": "noBpsRemaining",
      "msg": "No basis points remaining to allocate"
    },
    {
      "code": 6009,
      "name": "cannotSwapSameToken",
      "msg": "Cannot swap a token for itself"
    },
    {
      "code": 6010,
      "name": "insufficientVaultBalance",
      "msg": "Vault has insufficient token balance"
    },
    {
      "code": 6011,
      "name": "insufficientUserBalance",
      "msg": "User has insufficient token balance"
    },
    {
      "code": 6012,
      "name": "insufficientSolForFee",
      "msg": "Insufficient SOL to pay swap fee"
    },
    {
      "code": 6013,
      "name": "nothingToClaim",
      "msg": "Nothing to claim"
    },
    {
      "code": 6014,
      "name": "unauthorizedRecipient",
      "msg": "Unauthorized recipient"
    },
    {
      "code": 6015,
      "name": "vaultPermanentlyRenounced",
      "msg": "Vault is permanently renounced — tokens locked forever"
    },
    {
      "code": 6016,
      "name": "vaultStillLocked",
      "msg": "Vault is still locked — cannot withdraw yet"
    },
    {
      "code": 6017,
      "name": "withdrawalsLocked",
      "msg": "Withdrawals are currently locked"
    },
    {
      "code": 6018,
      "name": "invalidAccountData",
      "msg": "Invalid account data length"
    },
    {
      "code": 6019,
      "name": "alreadyRenounced",
      "msg": "Already renounced"
    },
    {
      "code": 6020,
      "name": "unauthorizedAuthority",
      "msg": "Unauthorized platform authority"
    },
    {
      "code": 6021,
      "name": "insufficientDepositAmount",
      "msg": "Token deposit must be at least 1% of total supply"
    },
    {
      "code": 6022,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6023,
      "name": "invalidRemainingAccounts",
      "msg": "Invalid remaining accounts length"
    },
    {
      "code": 6024,
      "name": "invalidVaultTokenAccount",
      "msg": "Invalid vault token account"
    },
    {
      "code": 6025,
      "name": "vaultNameTooLong",
      "msg": "Vault name too long"
    },
    {
      "code": 6026,
      "name": "depositAmountsMismatch",
      "msg": "Deposit amounts length mismatch"
    },
    {
      "code": 6027,
      "name": "cannotReferSelf",
      "msg": "Cannot refer yourself"
    },
    {
      "code": 6028,
      "name": "referralAlreadyRegistered",
      "msg": "Referral already registered for this user"
    },
    {
      "code": 6029,
      "name": "invalidReferralAccount",
      "msg": "Invalid referral account"
    }
  ],
  "types": [
    {
      "name": "lockType",
      "docs": [
        "Lock type for a vault — determines withdrawal behaviour."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "permanent"
          },
          {
            "name": "timed"
          }
        ]
      }
    },
    {
      "name": "platformConfig",
      "docs": [
        "Platform-wide configuration account.",
        "PDA seeds: [b\"platform\"]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "Ther team wallet — only this key can call update_platform"
            ],
            "type": "pubkey"
          },
          {
            "name": "platformWallet",
            "docs": [
              "Receives fees per swap/creation"
            ],
            "type": "pubkey"
          },
          {
            "name": "creationFee",
            "docs": [
              "Vault creation fee in lamports (default: 50_000_000 = 0.05 SOL)"
            ],
            "type": "u64"
          },
          {
            "name": "swapFee",
            "docs": [
              "Total swap fee in lamports (default: 7_000_000 = 0.007 SOL)"
            ],
            "type": "u64"
          },
          {
            "name": "platformFee",
            "docs": [
              "Platform portion of swap fee in lamports (default: 4_000_000 = 0.004 SOL)"
            ],
            "type": "u64"
          },
          {
            "name": "creatorFee",
            "docs": [
              "Creator portion of swap fee in lamports (default: 2_000_000 = 0.002 SOL)"
            ],
            "type": "u64"
          },
          {
            "name": "minimumDepositBps",
            "docs": [
              "Minimum deposit basis points per token (default: 100 = 1% of total supply)"
            ],
            "type": "u16"
          },
          {
            "name": "referralFee",
            "docs": [
              "Referral fee portion in lamports (default: 1_000_000 = 0.001 SOL)"
            ],
            "type": "u64"
          },
          {
            "name": "referralL1Bps",
            "docs": [
              "Referral Level 1 split basis points (default: 5000 = 50%)"
            ],
            "type": "u16"
          },
          {
            "name": "referralL2Bps",
            "docs": [
              "Referral Level 2 split basis points (default: 3000 = 30%)"
            ],
            "type": "u16"
          },
          {
            "name": "referralL3Bps",
            "docs": [
              "Referral Level 3 split basis points (default: 2000 = 20%)"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "referralAccount",
      "docs": [
        "Stores the referral chain (L1, L2, L3) for a given user.",
        "PDA seeds: [b\"referral\", user.key().as_ref()]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "The referred user"
            ],
            "type": "pubkey"
          },
          {
            "name": "referrerL1",
            "docs": [
              "Direct referrer (Level 1)"
            ],
            "type": "pubkey"
          },
          {
            "name": "referrerL2",
            "docs": [
              "Referrer's referrer (Level 2) — Pubkey::default() if none"
            ],
            "type": "pubkey"
          },
          {
            "name": "referrerL3",
            "docs": [
              "Level 3 referrer — Pubkey::default() if none"
            ],
            "type": "pubkey"
          },
          {
            "name": "totalSwaps",
            "docs": [
              "Total swaps this user has performed"
            ],
            "type": "u64"
          },
          {
            "name": "createdAt",
            "docs": [
              "Registration timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "revenueShare",
      "docs": [
        "Revenue share account — tracks a recipient's share of swap fees for a vault.",
        "PDA seeds: [b\"revenue\", vault.key().as_ref(), recipient.key().as_ref()]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "docs": [
              "The vault this revenue share belongs to"
            ],
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "docs": [
              "The wallet that receives this share"
            ],
            "type": "pubkey"
          },
          {
            "name": "shareBps",
            "docs": [
              "Basis points of creator fee (e.g. 1000 = 10%)"
            ],
            "type": "u16"
          },
          {
            "name": "accumulatedLamports",
            "docs": [
              "Accumulated claimable lamports"
            ],
            "type": "u64"
          },
          {
            "name": "totalClaimedLamports",
            "docs": [
              "Total lamports claimed historically"
            ],
            "type": "u64"
          },
          {
            "name": "addedAt",
            "docs": [
              "Unix timestamp when this entry was created"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "vault",
      "docs": [
        "Vault account that groups multiple SPL tokens.",
        "PDA seeds: [b\"vault\", creator.key().as_ref(), vault_name.as_bytes()]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "docs": [
              "The wallet that created this vault"
            ],
            "type": "pubkey"
          },
          {
            "name": "vaultName",
            "docs": [
              "Human-readable vault name (max 32 bytes), also used in PDA seeds"
            ],
            "type": "string"
          },
          {
            "name": "lockType",
            "docs": [
              "Lock type: Permanent or Timed"
            ],
            "type": {
              "defined": {
                "name": "lockType"
              }
            }
          },
          {
            "name": "lockExpiry",
            "docs": [
              "Unix timestamp when the lock expires — 0 if permanent"
            ],
            "type": "i64"
          },
          {
            "name": "isRenounced",
            "docs": [
              "If true, tokens are permanently locked and can never be withdrawn"
            ],
            "type": "bool"
          },
          {
            "name": "tokenMints",
            "docs": [
              "All registered token mint addresses (max 200)"
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "unallocatedBps",
            "docs": [
              "Remaining basis points available for revenue share allocation (starts at 10000)"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed"
            ],
            "type": "u8"
          }
        ]
      }
    }
  ]
};
