// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default; 
const Redis = require('ioredis');
const path = require('path');
const cookieParser = require('cookie-parser');
const viewsRouter = require('./router/viewsRouter');




const app = express();
const PORT = process.env.PORT || 3000;


// Configurar o tamanho máximo do corpo da requisição
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware para parsing de JSON
app.use(express.json());

// Configurar a pasta 'public' para arquivos estáticos (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// Configuração do Redis
const redisClient = new Redis({
    host: 'decent-bulldog-44204.upstash.io', // Substitua pelo host fornecido pelo Upstash
    port: 6379, // Porta padrão do Redis
    password: 'AaysAAIjcDE5NzM3NTkyYzFiYzc0ZDZiYmRhNTJkNjIzMzNhMTk4MXAxMA', // Substitua pela senha fornecida pelo Upstash
    tls: {} // Necessário para conexões seguras
});

app.use(cookieParser());

// Configuração da sessão
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'minha-chave-secreta', // Altere para uma chave forte
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Garante HTTPS
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None para cross-origin em produção
        maxAge: 1000 * 60 * 60 // 1 hora
    }
}));

// Usar o router para as views
app.use('/', viewsRouter);

app.get('/teste', (req, res) => {
    res.send('Rota de teste funcionando!');
});


app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
