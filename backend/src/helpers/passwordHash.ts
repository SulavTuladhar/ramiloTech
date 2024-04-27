const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

export async function generatePassword(password: string): Promise<string | Error> {
    try {
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    } catch (err) {
        return err as Error;
    }
}

export async function comparePassword(password: string, dbPassword: string) {
    try {
        return bcrypt.compareSync(password, dbPassword);
    } catch (err) {
        return err;
    }
}