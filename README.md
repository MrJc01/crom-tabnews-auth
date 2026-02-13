# tabnews-auth

Biblioteca JavaScript leve e agnóstica de framework para autenticação via API do TabNews. Projetada para distribuição via CDN e uso no frontend, sem dependências externas.

## Filosofia

**Transparência acima de tudo.** O código é escrito de forma legível e auditável por qualquer membro da comunidade TabNews. Não armazenamos senhas ou dados sensíveis; apenas facilitamos o tráfego seguro de tokens temporários.

## Funcionalidades

- `login(email, password)`: Autentica usuário e retorna token de sessão.
- `getProfile(username)`: Busca dados públicos de um usuário.
- `validateSession(token)`: Verifica validade de um token de sessão.

## Instalação

### Via CDN

Inclua o script no seu HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/MrJc01/crom-tabnews-auth@main/src/tabnews-auth.js"></script>
```

Uso:

```javascript
// Login
const session = await window.tabnewsAuth.login('email@example.com', 'password');
console.log(session.token);

// Perfil
const profile = await window.tabnewsAuth.getProfile('username');
console.log(profile);

// Validar sessão
const validSession = await window.tabnewsAuth.validateSession(session.token);
console.log(validSession);
```

### Como ES Module

```bash
npm install tabnews-auth
```

```javascript
import { login, getProfile, validateSession } from 'tabnews-auth';

const session = await login('email@example.com', 'password');
```

## Segurança

- **Zero dependências**: Usa apenas `fetch` e APIs nativas do navegador.
- **Não armazena senhas**: As credenciais são enviadas diretamente para a API do TabNews e descartadas imediatamente.
- **Tokens temporários**: Apenas trafegamos tokens de sessão, que devem ser gerenciados pelo desenvolvedor (ex: `sessionStorage`).
- **Transparência**: Todo o código é auditável. Não há minificação ou ofuscação.

## Exemplos

### Login e Armazenamento Seguro

```javascript
try {
  const session = await window.tabnewsAuth.login(email, password);
  // Armazenar token temporariamente (opcional)
  sessionStorage.setItem('tabnews_token', session.token);
  // Usar token para outras requisições
} catch (error) {
  console.error('Erro no login:', error.message);
}
```

### Buscar Perfil

```javascript
const profile = await window.tabnewsAuth.getProfile('filipedeschamps');
console.log(`Usuário: ${profile.username}, Nome: ${profile.name}`);
```

### Validar Sessão

```javascript
const token = sessionStorage.getItem('tabnews_token');
if (token) {
  try {
    await window.tabnewsAuth.validateSession(token);
    console.log('Sessão válida');
  } catch {
    console.log('Sessão expirada, faça login novamente');
  }
}
```

## Desenvolvimento

### Clonando e Instalando

```bash
git clone https://github.com/MrJc01/crom-tabnews-auth.git
cd crom-tabnews-auth
npm install
```

### Rodando Testes

```bash
npm test
```

### Demo Local

```bash
npm run demo
```

Abra `http://localhost:3000/demo/` no navegador.

## Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Fork o repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`).
4. Push para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

Certifique-se de que os testes passem e o código siga a filosofia de transparência.

## Licença

MIT