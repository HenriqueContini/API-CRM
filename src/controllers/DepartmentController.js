import Department from "../models/Department.js";

export default class DepartmentController {
    static async listDepartments(req, res) {
        try {
            const departments = await Department.findAll();

            res.status(200).json(departments);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: true, msg: 'Erro ao buscar os setores!'});
        }
    }
}

// Ao criar uma crm, deve vir um array com os setores envolvidos