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
            const user = await db.query(`select u.matricula, u.nome, u.email, s.nome as setor, u.imagem_usuario from usuarios u 
                inner join setores s on u.setor = s.cod_setor where u.matricula = :user`, {
                model: User,
                replacements: {
                    user: enrollment
                },
                type: QueryTypes.SELECT
            });

            if (user === null) {
                return { error: true, msg: 'Usuário não encontrado' };
            }

            return user[0];
        } catch (e) {
            console.log(e);
            return { error: true, msg: 'Falha ao tentar encontrar dados do usuário' };
        }
    }

    static async updateUser(enrollment, data, image) {
        const email = data.email;
        const password = data.senha;

        try {
            if (email) {
                await User.update({ email: email }, {
                    where: {
                        matricula: enrollment
                    }
                });
            }

            if (password) {
                await User.update({ senha: password }, {
                    where: {
                        matricula: enrollment
                    }
                })
            }

            if (image) {
                await User.update({ imagem_usuario: image.firebaseURL }, {
                    where: {
                        matricula: enrollment
                    }
                })
            }

            return { error: false, msg: "Atualizado com sucesso" };
        } catch (e) {
            console.log(e);
            return { error: true, msg: "Erro ao tentar atualizar o usuário!" };
        }
    }

    static async createUser(data) {
        try {
            const user = await User.findAll({
                where: {
                    matricula: data.matricula
                }
            })

            if (user.length >= 1) {
                return {error: true, msg: "Já existe um usuário com esta matrícula"};
            }

            await User.create({
                matricula: data.matricula,
                nome: data.nome,
                email: data.email,
                senha: data.senha,
                setor: data.setor_usuario
            })

            return {error: false, msg: 'Criado com sucesso!'}
        } catch (e) {
            console.log(e)
            return {error: true, msg: "Falha ao criar usuário!"}
        }
    }
}