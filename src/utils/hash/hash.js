import bcrypt from "bcrypt";

export const hash = ({ plainText, round = Number(process.env.ROUNDS) }) => {
    return bcrypt.hashSync(plainText, round);
}


export const compare = ({ plainText, hash }) => {
    return bcrypt.compare(plainText, hash);
};
