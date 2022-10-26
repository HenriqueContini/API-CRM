import Department from "../models/Department.js";
import { Op } from "sequelize";

export default class DepartmentController {
    static async listDepartments(req, res) {
        try {
            const departments = await Department.findAll({
                where: {
                    cod_setor: {
                        [Op.notIn]: [1, req.params.userdepartment]
                    }
                }
            });

            res.status(200).json(departments);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: true, msg: 'Erro ao buscar os setores!' });
        }
    }
}