import { QueryTypes } from "sequelize";
import db from "../config/dbconfig.js";
import User from "../models/User.js";

export default class UserService {
    static async login(enrollment, password) {
        try {
            const user = await User.findByPk(enrollment);
            if (user === null) {
                return { error: true, msg: 'Usuário não encontrado!' };
            }

            if (user.senha === password) {
                return { matricula: user.matricula, setor: user.setor };
            } else {
                return { error: true, msg: 'Senha incorreta!' };
            }
        } catch (e) {
            console.log(e);
            return { error: true, msg: 'Erro desconhecido!' };
        }
    }

    static async checkUser(enrollment) {
        try {
            const user = await User.findByPk(enrollment);

            if (user === null) {
                return { error: true, msg: "Usuário não encontrado!" };
            }

            delete user.senha;

            return user;
        } catch (e) {
            console.log(e)
            return { error: true, msg: "Ocorreu um erro ao tentar encontrar o usuário" };
        }
    }

    static async getUser(enrollment) {
        try {
            const user = await db.query(`select u.matricula, u.nome, u.email, s.nome as setor from usuarios u 
                inner join setores s on u.setor = s.cod_setor where u.matricula = :user`, {
                model: User,
                replacements: {
                    user: enrollment
                },
                type: QueryTypes.SELECT
            });

            if (user === null) {
                return {error: true, msg: 'Usuário não encontrado'};
            }

            return user[0];
        } catch (e) {
            console.log(e);
            return {error: true, msg: 'Falha ao tentar encontrar dados do usuário'};
        }
    }
}