const mongoose = require('mongoose');
const Menu = require('./models/Menu');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const updates = [
    { name: 'Idli Sambar',          image: '/src/assets/dishes/idly sambar.jpg' },
    { name: 'Chicken Soup',         image: '/src/assets/dishes/chicken soup.jpg' },
    { name: 'Aloo Paratha',         image: '/src/assets/dishes/aloo paratha.jpg' },
    { name: 'Masala Dosa',          image: '/src/assets/dishes/masala dosa.jpg' },
    { name: 'Upma',                 image: '/src/assets/dishes/upma.jpg' },
    { name: 'Poha',                 image: '/src/assets/dishes/poha.jpg' },
    { name: 'Gulab Jamun',          image: '/src/assets/dishes/gulab jamun.jpg' },
    { name: 'Grilled Fish',         image: '/src/assets/dishes/grilled fish.jpg' },
    { name: 'Chicken Fried Rice',   image: '/src/assets/dishes/chicken fried rice.jpg' },
    { name: 'Paneer Fried Rice',    image: '/src/assets/dishes/paneer fried rice.jpg' },
    { name: 'Palak Paneer',         image: '/src/assets/dishes/palak paneer.jpg' },
    { name: 'Masala Chai',          image: '/src/assets/dishes/masala chai.jpg' },
    { name: 'Fresh Lime Soda',      image: '/src/assets/dishes/Fresh Lime Soda.jpg' },
    { name: 'Mango Lassi',          image: '/src/assets/dishes/Mango Lassi.jpg' },
    { name: 'Paneer Butter Masala', image: '/src/assets/dishes/Paneer Butter Masala.jpg' },
    { name: 'Dal Makhani',          image: '/src/assets/dishes/Dal Makhani.jpg' },
    { name: 'Veg Biryani',          image: '/src/assets/dishes/Veg Biryani.jpg' },
    { name: 'Chole Bhature',        image: '/src/assets/dishes/Chole Bhature.jpg' },
    { name: 'Chicken Biryani',      image: '/src/assets/dishes/Chicken Biryani.jpg' },
    { name: 'Chicken Butter Masala',image: '/src/assets/dishes/Chicken Butter Masala.jpg' },
    { name: 'Mutton Rogan Josh',    image: '/src/assets/dishes/Mutton Rogan Josh.jpg' },
    { name: 'Paneer Tikka',         image: '/src/assets/dishes/Paneer Tikka.jpg' },
    { name: 'Veg Spring Rolls',     image: '/src/assets/dishes/Veg Spring Rolls.jpg' },
    { name: 'Hara Bhara Kabab',     image: '/src/assets/dishes/Hara Bhara Kabab.jpg' },
    { name: 'Chicken Tikka',        image: '/src/assets/dishes/Chicken Tikka.jpg' },
    { name: 'Seekh Kabab',          image: '/src/assets/dishes/Seekh Kabab.jpg' },
    { name: 'Fish Amritsari',       image: '/src/assets/dishes/Fish Amritsari.jpg' },
    { name: 'Samosa',               image: '/src/assets/dishes/Samosa.jpg' },
    { name: 'Veg Burger',           image: '/src/assets/dishes/Veg Burger.jpg' },
    { name: 'French Fries',         image: '/src/assets/dishes/French Fries.jpg' },
    { name: 'Veg Pizza',            image: '/src/assets/dishes/Veg Pizza.jpg' },
    { name: 'Chicken Burger',       image: '/src/assets/dishes/Chicken Burger.jpg' },
  ];

  for (const u of updates) {
    await Menu.findOneAndUpdate({ name: u.name }, { image: u.image });
    console.log(`Updated: ${u.name}`);
  }

  console.log('All 32 dishes updated with images!');
  process.exit();
});