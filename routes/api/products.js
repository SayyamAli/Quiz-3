const express = require('express');
let router = express.Router();

var {product, product} = require("../../models/product");
const validateProduct = require('../../middlewares/validateProducts');
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'snakecloud', 
    api_key: '494282718685512', 
    api_secret: 'ykZ8B12bVZFDQnqhna7Q2JcHaTE' 
  });

// get all products 
router.get("/",auth,async(req,res) =>{
    console.log(req.user);
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage:10);
    let skiprecord = perPage*(page-1);
   
        let products = await product.find().skip(skiprecord).limit(perPage);
    
    let totalProduct = await product.countDocuments();
    return res.send({products, totalProduct});
});
// get single products
router.get("/:id",async(req,res) =>{
    try {
        let single_prod = await product.findById(req.params.id);
        if(!single_prod) return res.status(400).send("product with given id is not present");
        return res.send(single_prod);
    } catch (err) {
        return res.status(400).send("invalid id");
    }
});

router.put("/:id",validateProduct,async(req,res)=>{
    let updated_product  = await product.findById(req.params.id);
    updated_product.name = req.body.name;
    updated_product.price = req.body.price;
    await updated_product.save();
    return res.send(updated_product);
});

router.delete("/:id",async(req,res)=>{
    let del_product  = await product.findByIdAndDelete(req.params.id);
    return res.send("product deleted");
});
// validateProduct
router.post("/",async(req,res)=>{
    // const file= req.files.photo;
    // cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    //     console.log(result);
    //     res.status(200).send("file upoaded on cloudinary");
    // })
    let new_product = new product();
    new_product.name = req.body.name;
    new_product.price = req.body.price;
    await new_product.save();
    return res.status(200).send(new_product);
});

module.exports = router;
