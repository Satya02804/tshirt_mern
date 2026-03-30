import sequelize from '../src/config/database.js';
import { User, Role, Permission } from '../src/models/index.js';
import bcrypt from 'bcryptjs';

//Seeder command 
//npm run seed

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Create permissions
        console.log('Creating permissions...');
        const permissions = [
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',
            'view-users',
            'delete-users',
            'update-permission',
            'view-dashboard',
            'view-analytics',
            'view-orders',
            'view-earnings',
            'add-to-cart',
            'checkout',
            'payment',
            'place-orders',
            'update-order-status',
            'view-roles',
            'create-permission',
            'edit-permission',
            'delete-role',
    
        ];

        const permissionInstances = {};
        for (const permName of permissions) {
            const [perm] = await Permission.findOrCreate({
                where: { name: permName }
            });
            permissionInstances[permName] = perm;
            console.log(`  ✓ ${permName}`);
        }

        // Create roles
        console.log('\nCreating roles...');

        // Super Admin Role
        const [superAdmin] = await Role.findOrCreate({
            where: { name: 'super-admin' }
        });
        await superAdmin.setPermissions(Object.values(permissionInstances));
        console.log('  ✓ super-admin (all permissions)');

        // Admin Role
        const [admin] = await Role.findOrCreate({
            where: { name: 'admin' }
        });
        await admin.setPermissions([
            permissionInstances['view-products'],
            permissionInstances['create-products'],
            permissionInstances['edit-products'],
            permissionInstances['delete-products'],
            permissionInstances['view-users'],
            permissionInstances['view-orders'],
            permissionInstances['view-earnings'],
            permissionInstances['view-dashboard'],
            permissionInstances['view-analytics'],
            permissionInstances['add-to-cart'],
            permissionInstances['checkout'],
            permissionInstances['payment'],
            permissionInstances['place-orders'],
            permissionInstances['update-order-status'],
            permissionInstances['delete-users'],
            permissionInstances['update-permission'],
        ]);
        console.log('  ✓ admin');

        // User Role
        const [userRole] = await Role.findOrCreate({
            where: { name: 'user' }
        });
        await userRole.setPermissions([
            permissionInstances['add-to-cart'],
            permissionInstances['checkout'],
            permissionInstances['payment'],
            permissionInstances['place-orders']
        ]);
        console.log('  ✓ user');

        // Create Super Admin User
        console.log('\nCreating super admin user...');
        const [superAdminUser, created] = await User.findOrCreate({
            where: { email: 'patelsatya2804@gmail.com' },
            defaults: {
                name: 'Super Admin',
                password: 'admin123' // Will be hashed by the model hook
            }
        });

        if (created) {
            await superAdminUser.setRoles([superAdmin]);
            console.log('  ✓ Super Admin user created');
            console.log('    Email: patelsatya2804@gmail.com');
            console.log('    Password: admin123');
        } else {
            // Ensure super admin has the role
            const hasRole = await superAdminUser.hasRole('super-admin');
            if (!hasRole) {
                await superAdminUser.setRoles([superAdmin]);
            }
            console.log('  ✓ Super Admin user already exists');
        }

        console.log('\n✅ Database seeding completed successfully!\n');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};

// Run seeder
const runSeeder = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established\n');

        // Sync database
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced\n');

        await seedDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    }
};

runSeeder();
