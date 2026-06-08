import { PrismaClient, Category, OrderStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  const MOCK_PRODUCTS = [
    { title: 'Luxury Resin Hamper', price: 120.0, category: 'GIFT_HAMPERS' as Category, imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80', description: 'A beautifully curated gift hamper featuring our finest handcrafted resin pieces, premium chocolates, and bespoke candles.' },
    { title: 'Ocean Wave Coasters Set of 4', price: 45.0, category: 'RESIN_COASTERS' as Category, imageUrl: 'https://images.unsplash.com/photo-1629851722880-b26aeb8f2df9?w=800&q=80', description: 'Bring the ocean to your table with these stunning wave-inspired resin coasters. Heat resistant and highly durable.' },
    { title: 'Botanical Resin Pendant', price: 35.0, category: 'RESIN_JEWELRY' as Category, imageUrl: 'https://images.unsplash.com/photo-1599643478514-4a888f615372?w=800&q=80', description: 'Real pressed flowers preserved forever in high-quality UV resin. Comes with a 925 sterling silver chain.' },
    { title: 'Custom Floral Letters', price: 60.0, category: 'CUSTOM_KEEPSAKES' as Category, imageUrl: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=800&q=80', description: 'Personalized resin letters filled with gold flakes and real pressed flowers.' },
  ]

  for (const product of MOCK_PRODUCTS) {
    const p = await prisma.product.create({
      data: product,
    })
    console.log(`Created product with id: ${p.id}`)
  }

  const MOCK_ORDERS = [
    { customerName: 'Emma Watson', email: 'emma@example.com', phone: '+123456789', address: '123 Baker St', totalAmount: 120.00, status: 'PENDING' as OrderStatus },
    { customerName: 'John Doe', email: 'john@example.com', phone: '+987654321', address: '456 Main St', totalAmount: 45.00, status: 'IN_PRODUCTION' as OrderStatus },
  ]

  for (const order of MOCK_ORDERS) {
    const o = await prisma.order.create({
      data: order,
    })
    console.log(`Created order with id: ${o.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
