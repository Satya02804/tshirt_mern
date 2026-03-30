import { Product } from '../models/index.js';
import sequelize from '../config/database.js';

export const getSitemap = async (req, res) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        // Fetch all products
        const products = await Product.findAll({
            attributes: ['id', 'updated_at']
        });

        // Fetch all categories
        const categories = await Product.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
            raw: true
        });

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

        // Add Categories
        categories.forEach(cat => {
            if (cat.category) {
                xml += `
  <url>
    <loc>${baseUrl}/category/${cat.category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
            }
        });

        // Add Products
        products.forEach(p => {
            xml += `
  <url>
    <loc>${baseUrl}/product/${p.id}</loc>
    <lastmod>${p.updated_at ? p.updated_at.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });

        xml += '\n</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap error:', error);
        res.status(500).send('Error generating sitemap');
    }
};
