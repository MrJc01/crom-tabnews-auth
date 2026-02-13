/**
 * Biblioteca tabnews-auth: Autenticação leve via API do TabNews
 *
 * Esta biblioteca é agnóstica de framework, usa apenas APIs nativas do navegador (fetch).
 * Não armazena senhas ou dados sensíveis; apenas facilita o tráfego de tokens temporários.
 * Toda comunicação é transparente e auditável.
 *
 * Filosofia: Transparência acima de tudo. O código é legível para auditoria comunitária.
 *
 * Uso:
 * - Como ES Module: import { login, getProfile, validateSession } from './tabnews-auth.js';
 * - Via CDN: <script src="tabnews-auth.js"></script> e usar window.tabnewsAuth.login, etc.
 */

const API_BASE = 'https://www.tabnews.com.br/api/v1';

/**
 * Realiza login enviando credenciais para a API do TabNews.
 * Retorna um objeto de sessão contendo token temporário.
 * Não armazena a senha; apenas a envia para a API.
 *
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} Objeto de sessão com token
 * @throws {Error} Se credenciais inválidas ou erro de rede
 */
export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Credenciais inválidas');
    }
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  }

  const session = await response.json();
  // O token é temporário e deve ser gerenciado pelo usuário (ex: sessionStorage)
  return session;
}

/**
 * Busca dados públicos do perfil de um usuário.
 * Não requer autenticação.
 *
 * @param {string} username - Nome de usuário
 * @returns {Promise<Object>} Dados públicos do perfil
 * @throws {Error} Se usuário não encontrado ou erro de rede
 */
export async function getProfile(username) {
  if (!username) {
    throw new Error('Nome de usuário é obrigatório');
  }

  const response = await fetch(`${API_BASE}/users/${username}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Usuário não encontrado');
    }
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Valida se um token de sessão ainda é válido.
 * Envia o token para verificação na API.
 *
 * @param {string} token - Token de sessão
 * @returns {Promise<Object>} Dados da sessão válida
 * @throws {Error} Se token inválido ou expirado
 */
export async function validateSession(token) {
  if (!token) {
    throw new Error('Token é obrigatório');
  }

  const response = await fetch(`${API_BASE}/sessions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token inválido ou expirado');
    }
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Para uso via <script> tag, anexa ao window
if (typeof window !== 'undefined') {
  window.tabnewsAuth = { login, getProfile, validateSession };
}