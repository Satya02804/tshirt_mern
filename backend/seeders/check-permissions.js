import sequelize from '../src/config/database.js';
import { User, Role, Permission } from '../src/models/index.js';

const checkSuperAdminPermissions = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Find super admin user
        const superAdmin = await User.findOne({
            where: { email: 'patelsatya2804@gmail.com' },
            include: [{
                association: 'roles',
                include: ['permissions']
            }]
        });

        if (!superAdmin) {
            console.log('❌ Super admin user not found');
            process.exit(1);
        }

        console.log('👤 User:', superAdmin.name);
        console.log('📧 Email:', superAdmin.email);
        console.log('\n🎭 Roles:');
        
        for (const role of superAdmin.roles) {
            console.log(`  - ${role.name}`);
            console.log('  Permissions:');
            for (const perm of role.permissions) {
                console.log(`    ✓ ${perm.name}`);
            }
        }

        // Check specifically for update-permission
        const hasUpdatePermission = superAdmin.roles.some(role =>
            role.permissions.some(perm => perm.name === 'update-permission')
        );

        console.log('\n🔍 Has update-permission:', hasUpdatePermission ? '✅ YES' : '❌ NO');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkSuperAdminPermissions();
