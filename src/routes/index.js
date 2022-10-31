import express from 'express';
import UserRoutes from './UserRoutes.js';
import CRMRoutes from './CRMRoutes.js';
import DepartmentRoutes from './DepartmentRoutes.js';
import ApprovalRoutes from './ApprovalRoutes.js'
import cors from 'cors';

const routes = (app) => {
    app.use(
        express.json(),
        express.urlencoded({ extended: false }),
        cors(),
        UserRoutes,
        CRMRoutes,
        DepartmentRoutes,
        ApprovalRoutes
    );

    app.get('/', (req, res) => {
        res.send('Funcionou!');
    })
}

export default routes;