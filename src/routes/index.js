import express from 'express';
import UserRoutes from './UserRoutes.js';
import CRMRoutes from './CRMRoutes.js';
import DepartmentRoutes from './DepartmentRoutes.js';

const routes = (app) => {
    app.use(
        express.json(),
        express.urlencoded({ extended: false }),
        UserRoutes,
        CRMRoutes,
        DepartmentRoutes
    );

    app.get('/', (req, res) => {
        res.send('Funcionou!');
    })
}

export default routes;