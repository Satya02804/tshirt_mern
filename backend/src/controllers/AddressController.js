import { Address } from '../models/index.js';

export const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, address_line, city, state, zip, is_default } = req.body;

        // If this address is set as default, unset others first
        if (is_default) {
            await Address.update(
                { is_default: false },
                { where: { user_id: userId } }
            );
        }

        const address = await Address.create({
            user_id: userId,
            name,
            phone,
            address_line,
            city,
            state,
            zip,
            is_default: is_default || false
        });

        res.status(201).json({
            status: 'success',
            message: 'Address added successfully',
            data: address
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error adding address',
            error: process.env.APP_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await Address.findAll({
            where: { user_id: userId },
            order: [['is_default', 'DESC'], ['created_at', 'DESC']]
        });

        res.json({
            status: 'success',
            data: addresses
        });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching addresses',
            error: process.env.APP_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, phone, address_line, city, state, zip, is_default } = req.body;

        const address = await Address.findOne({
            where: { id, user_id: userId }
        });

        if (!address) {
            return res.status(404).json({
                status: 'error',
                message: 'Address not found'
            });
        }

        if (is_default && !address.is_default) {
            await Address.update(
                { is_default: false },
                { where: { user_id: userId } }
            );
        }

        await address.update({
            name,
            phone,
            address_line,
            city,
            state,
            zip,
            is_default
        });

        res.json({
            status: 'success',
            message: 'Address updated successfully',
            data: address
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating address',
            error: process.env.APP_ENV === 'development' ? error.message : undefined
        });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await Address.destroy({
            where: { id, user_id: userId }
        });

        if (result === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Address not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Address deleted successfully'
        });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting address',
            error: process.env.APP_ENV === 'development' ? error.message : undefined
        });
    }
};
