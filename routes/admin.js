var express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const productHelpers = require('../helpers/product-helpers');
const { route } = require('./user');

var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{admin:true, products})


  })
  
 
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})
})
router.post('/add-product',(req,res)=>{
  console.log(req.body);
  console.log(req.files.Image);
  productHelpers.addProduct(req.body,(insertedId)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+insertedId+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-product")

      }
    })
    
  })
})
router.get('/delete-product/:_id',(req,res)=>{
  let proId=req.params._id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })




})

router.get('/edit-product/:_id',async (req,res)=>{
  let product=await productHelpers.getProductDetail(req.params._id)
  console.log(product);
  res.render('admin/edit-product',{admin:true,product})
})

router.post('/edit-product/:_id',(req,res)=>{
  let insertedId=req.params._id
  productHelpers.updateProduct(req.params._id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){

      let image=req.files.Image
      image.mv('./public/product-images/'+insertedId+'.jpg')

    }
  })

})

module.exports = router;
