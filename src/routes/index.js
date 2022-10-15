import express from 'express';
import UserRoutes from './UserRoutes.js'

const routes = (app) => {
    app.use(
        express.json(),
        express.urlencoded({ extended: false }),
        UserRoutes
    );

    app.get('/', (req, res) => {
        res.send('Funcionou!');
    })
}

export default routes;