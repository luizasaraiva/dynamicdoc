# DynamicDoc — Portal de Conhecimento

Protótipo funcional em HTML, CSS e JavaScript puro para abrir no VS Code.

## Como abrir

1. Extraia a pasta `dynamicdoc`.
2. Abra a pasta no Visual Studio Code.
3. Abra o arquivo `index.html` no navegador.
4. Para melhor experiência, use a extensão **Live Server** do VS Code e clique em **Go Live**.

## Acessos simulados

Na tela inicial, clique em **Entrar** e escolha um perfil:

- Usuário: visualiza artigos publicados.
- Colaborador: visualiza artigos e pode simular sugestão.
- Administrador: acessa o painel administrativo, cria, edita, exclui artigos e adiciona comentários internos.

## Observação

Este é um protótipo local. Os dados ficam salvos no `localStorage` do navegador.
Para virar sistema real externo com login e banco de dados, a próxima etapa recomendada é conectar com Supabase ou Firebase.


## Como conectar ao Supabase

1. Crie um projeto no Supabase.
2. Abra `supabase.sql`, copie tudo e execute no **SQL Editor** do Supabase.
3. No Supabase, vá em **Project Settings > API**.
4. Copie o **Project URL** e a **anon public key**.
5. Abra o arquivo `supabase-config.js`.
6. Substitua:

```js
url: 'https://SEU-PROJETO.supabase.co',
anonKey: 'SUA-CHAVE-ANON-PUBLIC'
```

Depois disso, os artigos, processos internos, clientes e usuários agência passam a sincronizar com o Supabase.
Se você ainda não preencher esses dados, o sistema continua funcionando com salvamento local no navegador.
