/**
 * Network settings for the Stellar integration (week 4).
 * Everything comes from NEXT_PUBLIC_* env vars so the same build can target testnet or mainnet.
 */
export const red = {
  nombre: process.env.NEXT_PUBLIC_STELLAR_RED ?? "testnet",
  rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org",
  passphrase: process.env.NEXT_PUBLIC_STELLAR_PASSPHRASE ?? "Test SDF Network ; September 2015",
  /** Soroban `RegistroLotes` contract id; empty until it is deployed. */
  contratoId: process.env.NEXT_PUBLIC_CONTRATO_REGISTRO_LOTES ?? "",
  explorador: process.env.NEXT_PUBLIC_STELLAR_EXPLORADOR ?? "https://stellar.expert/explorer/testnet",
};

/** True while signatures are simulated (no contract configured). */
export const simulada = red.contratoId === "";

/** Estimated sponsored fee per signature, in XLM, shown in the admin panel. */
export const comisionEstimadaXlm = 0.0005;
