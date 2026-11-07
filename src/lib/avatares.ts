import avataresJson from '@/data/avatares.json';
import type { AvatarOpcao } from '@/types';

export const AVATARES = avataresJson as AvatarOpcao[];

export function obterAvatar(id?: string): AvatarOpcao {
  return AVATARES.find((a) => a.id === id) ?? AVATARES[0];
}
