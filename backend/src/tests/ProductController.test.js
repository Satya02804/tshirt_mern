import request from 'supertest';
import { jest, describe, it, expect } from '@jest/globals';
import app from '../app.js';
import { Product } from '../models/index.js';

describe('ProductController', () => {
  describe('GET /api/products', () => {
    it('should return all products with status 200', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Test Shirt',
          url: 'http://test.com/image.jpg',
          category: 'Test',
          price: 100,
          discount: 10,
          getDiscountedPrice: () => 90,
          sizes: ['M'],
          stock: { 'M': 10 }
        }
      ];

      const spy = jest.spyOn(Product, 'findAll').mockResolvedValue(mockProducts);

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toEqual(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].name).toEqual('Test Shirt');
      
      spy.mockRestore();
    });

    it('should handle errors and return status 500', async () => {
      const spy = jest.spyOn(Product, 'findAll').mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Error fetching products');
      
      spy.mockRestore();
    });
  });
});
