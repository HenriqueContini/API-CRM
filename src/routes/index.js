import express from 'express';

const routes = (app) => {
    app.get('/', (req, res) => {
        res.send('Funcionou!');
    })

    app.use(express.json());
}

export default routes;