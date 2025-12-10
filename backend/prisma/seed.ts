import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
    // Electronics
    {
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop with M3 Pro chip, 16GB RAM, 512GB SSD',
        price: 2499.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        stock: 15,
    },
    {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip, 256GB storage',
        price: 1199.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1592286927505-c5d1c36c7c3e?w=500',
        stock: 30,
    },
    {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-cancelling wireless headphones',
        price: 399.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        stock: 45,
    },
    {
        name: 'iPad Air',
        description: '10.9-inch Liquid Retina display, M1 chip',
        price: 599.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        stock: 20,
    },
    {
        name: 'Samsung 4K Monitor',
        description: '27-inch 4K UHD monitor with HDR10',
        price: 449.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        stock: 12,
    },

    // Clothing
    {
        name: 'Nike Air Max',
        description: 'Comfortable running shoes with Air cushioning',
        price: 129.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        stock: 50,
    },
    {
        name: 'Levi\'s 501 Jeans',
        description: 'Classic straight fit denim jeans',
        price: 79.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1542272454315-7ad2ca4a6a5e?w=500',
        stock: 60,
    },
    {
        name: 'Patagonia Fleece Jacket',
        description: 'Warm and sustainable outdoor jacket',
        price: 159.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        stock: 35,
    },
    {
        name: 'Adidas Originals T-Shirt',
        description: 'Cotton t-shirt with classic trefoil logo',
        price: 29.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        stock: 100,
    },
    {
        name: 'Ray-Ban Sunglasses',
        description: 'Classic Wayfarer style sunglasses',
        price: 159.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
        stock: 40,
    },

    // Home & Garden
    {
        name: 'Dyson V15 Vacuum',
        description: 'Cordless vacuum with laser detection',
        price: 649.99,
        category: 'Home & Garden',
        imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',
        stock: 18,
    },
    {
        name: 'KitchenAid Stand Mixer',
        description: 'Professional 5-quart stand mixer',
        price: 449.99,
        category: 'Home & Garden',
        imageUrl: 'https://images.unsplash.com/photo-1578663248264-1f60f9b27e96?w=500',
        stock: 25,
    },
    {
        name: 'Nespresso Coffee Machine',
        description: 'Espresso and lungo coffee maker',
        price: 199.99,
        category: 'Home & Garden',
        imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
        stock: 30,
    },
    {
        name: 'Plant Grow Light',
        description: 'LED grow light for indoor plants',
        price: 79.99,
        category: 'Home & Garden',
        imageUrl: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=500',
        stock: 45,
    },
    {
        name: 'Ceramic Planter Set',
        description: 'Set of 3 modern ceramic planters',
        price: 49.99,
        category: 'Home & Garden',
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
        stock: 70,
    },

    // Books
    {
        name: 'The Pragmatic Programmer',
        description: 'Classic software development book',
        price: 39.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
        stock: 80,
    },
    {
        name: 'Atomic Habits',
        description: 'Tiny changes, remarkable results',
        price: 24.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500',
        stock: 120,
    },
    {
        name: 'Clean Code',
        description: 'A handbook of agile software craftsmanship',
        price: 44.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
        stock: 65,
    },
    {
        name: 'The Design of Everyday Things',
        description: 'Classic book on user-centered design',
        price: 29.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
        stock: 55,
    },
    {
        name: 'Thinking, Fast and Slow',
        description: 'Nobel Prize winner on human decision making',
        price: 19.99,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500',
        stock: 90,
    },

    // Sports & Outdoors
    {
        name: 'Yoga Mat Premium',
        description: 'Non-slip yoga mat with carrying strap',
        price: 49.99,
        category: 'Sports & Outdoors',
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        stock: 75,
    },
    {
        name: 'Camping Tent 4-Person',
        description: 'Waterproof dome tent for outdoor adventures',
        price: 199.99,
        category: 'Sports & Outdoors',
        imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500',
        stock: 22,
    },
    {
        name: 'Hydro Flask Water Bottle',
        description: '32oz insulated stainless steel bottle',
        price: 44.99,
        category: 'Sports & Outdoors',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
        stock: 150,
    },
    {
        name: 'Resistance Bands Set',
        description: 'Set of 5 resistance bands for home workouts',
        price: 29.99,
        category: 'Sports & Outdoors',
        imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500',
        stock: 200,
    },
    {
        name: 'Mountain Bike Helmet',
        description: 'Safety helmet with ventilation system',
        price: 79.99,
        category: 'Sports & Outdoors',
        imageUrl: 'https://images.unsplash.com/photo-1557689560-f4b9e4f8c1a5?w=500',
        stock: 40,
    },
];

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data
    await prisma.product.deleteMany();
    console.log('✅ Cleared existing products');

    // Create products
    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log(`✅ Created ${products.length} products`);
    console.log('🎉 Seed completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });