import * as Crypto from 'expo-crypto';

// ATENÇÃO (protótipo): SHA-256 com salt é um "hash simples" só para não guardar
// senha em texto puro. Em produção use um backend com bcrypt/argon2.

export const SENHA_DEMO = 'cloud123';

export function gerarSalt(): string {
  return Crypto.randomUUID();
}

export function gerarId(): string {
  return Crypto.randomUUID();
}

export async function hashSenha(senha: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${senha}`);
}
