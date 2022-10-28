import DepartmentService from "../services/DepartmentService.js";

export default class DepartmentController {
    static async getDepartments(req, res) {
        const userDepartment = Number(req.params.userdepartment);

        if (isNaN(userDepartment)) {
            return res.status(500).json({error: true, msg: "Houve um erro ao fazer a requisição"});
        }

        const departments = await DepartmentService.listDepartments(userDepartment);

        if (departments.error === true) {
            return res.status(500).json(departments);
        }

        return res.status(200).json(departments);
    }
}