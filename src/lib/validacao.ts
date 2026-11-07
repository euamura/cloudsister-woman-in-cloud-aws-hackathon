// Validações puras do formulário de cadastro (sem dependência de React/Expo).

export const IDADE_MIN = 14;
export const IDADE_MAX = 90;
export const SENHA_MIN = 6;

export interface CamposCadastro {
  nome: string;
  idade: string;
  usuario: string;
  senha: string;
  temAvatar: boolean;
  afinidadeEscolhida: boolean;
}

export type ErrosCadastro = Partial<Record<keyof CamposCadastro, string>>;

const REGEX_USUARIO = /^[a-z0-9_.]{3,20}$/;

export function normalizar(valor: string): string {
  return valor.trim().toLowerCase();
}

export function validarCadastro(c: CamposCadastro): ErrosCadastro {
  const erros: ErrosCadastro = {};

  if (c.nome.trim().length < 2) erros.nome = 'Digite seu nome.';

  const idade = Number(c.idade);
  if (!Number.isInteger(idade) || idade < IDADE_MIN || idade > IDADE_MAX) {
    erros.idade = `Informe uma idade entre ${IDADE_MIN} e ${IDADE_MAX}.`;
  }

  if (!REGEX_USUARIO.test(normalizar(c.usuario))) {
    erros.usuario = 'Use 3 a 20 caracteres: letras, números, ponto ou _.';
  }

  if (c.senha.length < SENHA_MIN) {
    erros.senha = `A senha precisa de pelo menos ${SENHA_MIN} caracteres.`;
  }

  if (!c.temAvatar) erros.temAvatar = 'Escolha um avatar.';
  if (!c.afinidadeEscolhida) erros.afinidadeEscolhida = 'Conte qual sua afinidade com tech.';

  return erros;
}
