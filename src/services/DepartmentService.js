import Department from "../models/Department.js";
import { Op } from "sequelize";

export default class DepartmentService {
    static async listDepartments(userDepartment) {
        try {
            const departments = await Department.findAll({
                where: {
                    cod_setor: {
                        [Op.notIn]: [1, userDepartment]
                    }
                }
            })

            return departments;
        } catch (e) {
            return { error: true, msg: 'Erro ao buscar os setores!' };
        }
    }

    static async listAllDepartments() {
        try {
            const departments = await Department.findAll()

            return departments;
        } catch (e) {
            return { error: true, msg: 'Erro ao buscar os setores!' };
        }
    }
}