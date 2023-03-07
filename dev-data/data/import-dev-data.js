const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../../models/productModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose.set('strictQuery', true);

mongoose.connect(DB, err => {
  if(err) throw err
  console.log("DB Connection Successful!");
});

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));

//Import data into DB
const importData = async () => {
    try {
        await Product.create(products);
        process.exit();
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err);
    }
};

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try {
        await Product.deleteMany();
        process.exit();
        console.log("Data successfully deleted!");
    } catch (err) {
        console.log(err);
    }
}

if(process.argv[2] === '--import'){
    importData()
} else if(process.argv[2] === '--delete'){
    deleteData()
}