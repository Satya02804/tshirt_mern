'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tshirts = [
      {
        name: "Thar Roxx T-Shirt",
        url: "https://chriscross.in/cdn/shop/files/MahindraTharRoxxgreentshirt.jpg?v=1747661046&width=1000",
        price: 799,
        category: "Round Neck",
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        size: "M",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Yamaha RD350 - The Original Superbike T-Shirt",
        url: "https://chriscross.in/cdn/shop/files/ChrisCrossYamahaRD350blackcottontshirt.jpg?v=1740994644&width=1000",
        price: 799,
        category: "Round Neck",
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        size: "M",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Yamaha RD 350 Torque Induction Bikers T-Shirt",
        url: "https://chriscross.in/cdn/shop/files/YamahaRD350bluetshirt_b18d3a40-8d58-4db5-b08b-36cab421fdf0.jpg?v=1740994650&width=1000",
        price: 899,
        category: "Round Neck",
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        size: "M",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Himalayan Spirit",
        url: "https://chriscross.in/cdn/shop/files/RoyalEnfieldHimalayan450Tshirtblackcotton.jpg?v=1740994031&width=1000",
        price: 799,
        category: "Round Neck",
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        size: "M",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Suzuki Jimny T-Shirt",
        url: "https://chriscross.in/cdn/shop/files/SuzukiJimnyTshirtBeigecottontshirtmens.jpg?v=1745402090&width=1000",
        price: 849,
        category: "Round Neck",
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        size: "M",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Yamaha RX100 T-Shirt",
        url: "https://chriscross.in/cdn/shop/files/YamahaRX100ChrisCrossCottonTshirtBlack.jpg?v=1740994062&width=1000",
        price: 749,
        category: "Round Neck",
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        size: "M",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Classic Mercedes Benz T Shirt",
        url: "https://chriscross.in/cdn/shop/files/ChrisCrossMercedesBenzClassic90stshirt.jpg?v=1740994620&width=1000",
        price: 699,
        category: "Round Neck",
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        size: "M",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Suzuki Jimny Oversized T-Shirt",
        url: "https://chriscross.in/cdn/shop/files/JimnyOversizedT-shirtNavyblue.jpg?v=1748928220&width=600",
        price: 1299,
        category: "Oversized T-Shirt",
        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        size: "M",
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Same as Product::insert($tshirts)
    return queryInterface.bulkInsert('products', tshirts, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Equivalent to deleting seeded data
    return queryInterface.bulkDelete('products', null, {});
  }
};
