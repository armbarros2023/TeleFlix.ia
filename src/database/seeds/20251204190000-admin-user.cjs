const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    id: 'c0c66070-5555-4444-3333-222222222222',
                    name: 'Administrador',
                    email: 'admin@teleflix.com.br',
                    password_hash: await bcrypt.hash('123456', 8),
                    admin: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('users', null, {});
    },
};
