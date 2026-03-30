import { Order, OrderItem, Product } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

export const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: { id, userId },
            include: [
                { association: 'items', include: [{ association: 'product' }] },
                { association: 'user', attributes: ['name', 'email'] }
            ]
        });

        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
        doc.pipe(res);

        // --- Branding & Colors ---
        const primaryColor = '#2563eb'; // Modern Blue
        const secondaryColor = '#64748b'; // Slate Gray
        const tableHeaderBg = '#f1f5f9';

        // --- Header Section ---
        doc.rect(0, 0, 612, 40).fill(primaryColor); 

        doc.fillColor('#fff').fontSize(20).font('Helvetica-Bold').text('T-Shirt Store', 50, 12);
        
        doc.fillColor(primaryColor).fontSize(25).text('INVOICE', 50, 60);
        
        doc.fillColor('#000').fontSize(10).font('Helvetica-Bold').text('T-Shirt Store Official', 400, 65, { align: 'right' });
        doc.font('Helvetica').fillColor(secondaryColor)
           .text('123 Fashion Street, Suite 404', 400, 80, { align: 'right' })
           .text('Gujarat, India - 380001', 400, 95, { align: 'right' })
           .text('GSTIN: 24AAAAA0000A1Z5', 400, 110, { align: 'right' });

        doc.moveTo(50, 140).lineTo(550, 140).strokeColor('#e2e8f0').stroke();

        // --- Info Section ---
        doc.fillColor('#000').font('Helvetica-Bold').fontSize(11).text('BILL TO:', 50, 160);
        doc.font('Helvetica').fillColor('#000')
           .text(order.user.name, 50, 175)
           .fillColor(secondaryColor)
           .text(order.user.email, 50, 190)
           .text(order.shippingAddress || 'No address provided', 50, 205, { width: 200 });

        doc.fillColor('#000').font('Helvetica-Bold').text('INVOICE DETAILS:', 350, 160);
        doc.font('Helvetica').fillColor(secondaryColor)
           .text(`Invoice No:`, 350, 175).fillColor('#000').text(order.orderNumber, 450, 175)
           .fillColor(secondaryColor).text(`Date:`, 350, 190).fillColor('#000').text(formatDate(order.created_at), 450, 190)
           .fillColor(secondaryColor).text(`Status:`, 350, 205).fillColor(primaryColor).text(order.status.toUpperCase(), 450, 205);

        // --- Table Header ---
        const tableTop = 260;
        doc.rect(50, tableTop, 500, 25).fill(tableHeaderBg);
        
        doc.fillColor(secondaryColor).font('Helvetica-Bold').fontSize(10);
        doc.text('PRODUCT DESCRIPTION', 60, tableTop + 8);
        doc.text('SIZE', 280, tableTop + 8);
        doc.text('QTY', 350, tableTop + 8, { width: 50, align: 'center' });
        doc.text('PRICE (INR)', 410, tableTop + 8, { width: 60, align: 'right' });
        doc.text('TOTAL (INR)', 480, tableTop + 8, { width: 60, align: 'right' });

        // --- Items ---
        let y = tableTop + 35;
        doc.font('Helvetica').fillColor('#000');

        order.items.forEach((item, index) => {
            const itemTotal = Number(item.price) * item.quantity;
            
            if (index % 2 !== 0) {
                doc.rect(50, y - 5, 500, 20).fill('#f8fafc');
            }
            
            doc.fillColor('#000').text(item.product.name, 60, y);
            doc.text(item.size, 280, y);
            doc.text(item.quantity, 350, y, { width: 50, align: 'center' });
            doc.text(`${Number(item.price).toFixed(2)}`, 410, y, { width: 60, align: 'right' });
            doc.font('Helvetica-Bold').text(`${itemTotal.toFixed(2)}`, 480, y, { width: 60, align: 'right' });
            
            doc.font('Helvetica');
            y += 25;
        });

        // --- Summary Section ---
        doc.moveTo(350, y + 10).lineTo(550, y + 10).strokeColor('#e2e8f0').stroke();
        
        y += 25;
        doc.fontSize(10).fillColor(secondaryColor).text('Subtotal:', 350, y);
        doc.fillColor('#000').text(`${Number(order.totalPrice).toFixed(2)}`, 480, y, { width: 60, align: 'right' });

        y += 20;
        doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text('Grand Total:', 350, y);
        doc.text(`${Number(order.totalPrice).toFixed(2)}`, 480, y, { width: 60, align: 'right' });

        // --- Footer Section ---
        const footerTop = 730;
        doc.rect(50, footerTop, 500, 1).fill('#e2e8f0');
        doc.fontSize(9).fillColor(secondaryColor)
           .text('Payment is due within 15 days. Please make checks payable to Mahakali ERP.', 50, footerTop + 15, { align: 'center', width: 500 })
           .fillColor(primaryColor).font('Helvetica-Bold')
           .text('Thank you for choosing Mahakali ERP!', 50, footerTop + 30, { align: 'center', width: 500 });

        doc.end();

    } catch (error) {
        console.error('Invoice generation error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to generate invoice' });
    }
};

export const placeOrder = async (req, res) => {
    const transaction = await Order.sequelize.transaction();

    try {
        const { address, phone, payment_method, cart, email, notes } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cart is empty'
            });
        }

        // Determine user or guest
        const userId = req.user ? req.user.id : null;
        
        // If guest, email is required
        if (!userId && !email) {
             return res.status(400).json({
                status: 'error',
                message: 'Email is required for guest checkout'
            });
        }

        let totalAmount = 0;
        const orderItemsData = [];

        // Calculate total and prepare order items
        for (const item of cart) {
            const product = await Product.findByPk(item.id);

            if (!product) {
                await transaction.rollback();
                return res.status(404).json({
                    status: 'error',
                    message: `Product with ID ${item.id} not found`
                });
            }

            const size = item.size || 'M';
            
            // Check stock
            if (!product.stock || !product.stock[size] || product.stock[size] < (item.quantity || 1)) {
                await transaction.rollback();
                return res.status(400).json({
                    status: 'error',
                    message: `Insufficient stock for ${product.name} in size ${size}`
                });
            }

            let price = product.getDiscountedPrice();
            
            // Apply size modifier
            if (size === 'L') price += 50;
            else if (size === 'XL') price += 100;
            else if (size === 'XXL') price += 150;

            const quantity = item.quantity || 1;
            totalAmount += price * quantity;

            // Decrement stock
            const updatedStock = { ...product.stock };
            updatedStock[size] -= quantity;
            product.stock = updatedStock;
            await product.save({ transaction });

            orderItemsData.push({
                product_id: product.id,
                quantity,
                price,
                size
            });
        }

        // Create order
        const order = await Order.create({
            userId: userId,
            email: req.user ? req.user.email : email,
            orderNumber: 'ORD-' + uuidv4().substring(0, 10).toUpperCase(),
            totalPrice: totalAmount,
            shippingAddress: address,
            phone,
            paymentMethod: payment_method,
            notes: notes || null,
            status: 'pending'
        }, { transaction });

        // Create order items
        for (const itemData of orderItemsData) {
            await OrderItem.create({
                orderId: order.id,
                productId: itemData.product_id,
                quantity: itemData.quantity,
                price: itemData.price,
                size: itemData.size
            }, { transaction });
        }

        await transaction.commit();

        res.json({
            status: 200,
            message: 'Order placed successfully!',
            data: order,
            redirect_url: '/products'
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Place order error:', error);
        res.status(500).json({
            status: 500,
            message: 'Failed to place order: ' + error.message
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const { status, search } = req.query;
        const { Op } = (await import('sequelize')).default;

        let whereClause = { userId: req.user.id };

        if (status && status !== 'all') {
            if (status === 'in-progress') {
                whereClause.status = { [Op.in]: ['pending', 'processing', 'shipped'] };
            } else {
                whereClause.status = status;
            }
        }

        let includeClause = [{
            association: 'items',
            include: [{
                association: 'product'
            }]
        }];

        if (search) {
            whereClause = {
                [Op.and]: [
                    whereClause,
                    {
                        [Op.or]: [
                            { orderNumber: { [Op.like]: `%${search}%` } },
                            { '$items.product.name$': { [Op.like]: `%${search}%` } }
                        ]
                    }
                ]
            };
        }
              
        const orders = await Order.findAll({
            where: whereClause,
            include: includeClause,
            order: [['created_at', 'DESC']],
            subQuery: false
        });
     
        res.json({
            status: 'success',
            data: orders
        });
    } catch (error) {
        console.error('Fetch my orders error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching orders: ' + error.message
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    association: 'items',
                    include: [{
                        association: 'product'
                    }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            status: 'success',
            data: orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching orders'
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            status: 'success',
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update order status'
        });
    }
};
