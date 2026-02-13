import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, getProfile, validateSession } from '../src/tabnews-auth.js';

// Mock global do fetch
global.fetch = vi.fn();

describe('tabnews-auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar sessão em login bem-sucedido', async () => {
      const mockSession = { token: 'fake-token', user: { id: 1 } };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSession),
      });

      const result = await login('test@example.com', 'password');

      expect(fetch).toHaveBeenCalledWith('https://www.tabnews.com.br/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      });
      expect(result).toEqual(mockSession);
    });

    it('deve lançar erro para credenciais inválidas', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(login('test@example.com', 'wrong')).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro para erro de rede', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(login('test@example.com', 'password')).rejects.toThrow('Network error');
    });

    it('deve lançar erro se email ou senha ausentes', async () => {
      await expect(login('', 'password')).rejects.toThrow('Email e senha são obrigatórios');
      await expect(login('test@example.com', '')).rejects.toThrow('Email e senha são obrigatórios');
    });
  });

  describe('getProfile', () => {
    it('deve retornar perfil em busca bem-sucedida', async () => {
      const mockProfile = { username: 'testuser', name: 'Test User' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      });

      const result = await getProfile('testuser');

      expect(fetch).toHaveBeenCalledWith('https://www.tabnews.com.br/api/v1/users/testuser');
      expect(result).toEqual(mockProfile);
    });

    it('deve lançar erro para usuário não encontrado', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getProfile('nonexistent')).rejects.toThrow('Usuário não encontrado');
    });

    it('deve lançar erro para erro de rede', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getProfile('testuser')).rejects.toThrow('Network error');
    });

    it('deve lançar erro se username ausente', async () => {
      await expect(getProfile('')).rejects.toThrow('Nome de usuário é obrigatório');
    });
  });

  describe('validateSession', () => {
    it('deve retornar sessão válida', async () => {
      const mockSession = { token: 'valid-token', user: { id: 1 } };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSession),
      });

      const result = await validateSession('valid-token');

      expect(fetch).toHaveBeenCalledWith('https://www.tabnews.com.br/api/v1/sessions', {
        headers: { 'Authorization': 'Bearer valid-token' },
      });
      expect(result).toEqual(mockSession);
    });

    it('deve lançar erro para token inválido', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(validateSession('invalid-token')).rejects.toThrow('Token inválido ou expirado');
    });

    it('deve lançar erro para erro de rede', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(validateSession('token')).rejects.toThrow('Network error');
    });

    it('deve lançar erro se token ausente', async () => {
      await expect(validateSession('')).rejects.toThrow('Token é obrigatório');
    });
  });

  // A biblioteca não gerencia persistência; é responsabilidade do usuário
  // Exemplo: sessionStorage.setItem('token', session.token);
});