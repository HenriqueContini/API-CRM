import express from 'express';

const routes = (app) => {
    app.use(
        express.json(),
        express.urlencoded({ extended: false })
    );

    app.get('/', (req, res) => {
        res.send('Funcionou!');
    })
}

export default routes;