import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync('aaaaaa',10),
        isAdmin: true
    },
    {
        name: 'u1 user',
        email: 'u1@email.com',
        password: bcrypt.hashSync('111111',10),
        isAdmin: false
    }
];

export  default users;