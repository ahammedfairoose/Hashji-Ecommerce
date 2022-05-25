var db=require('../config/connection');
var collection=require('../config/collections');
const bcrypt=require('bcrypt');
const async = require('hbs/lib/async');
const { response } = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const { reject } = require('bcrypt/promises');
var objectId=require('mongodb').ObjectId;
const { ObjectId, Db } = require('mongodb');
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            resolve(data.insertedId)

        })
            
        })
        

    },

    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("Login Success");
                        res.user=user;
                        res.status=true;
                        resolve(response)
                    }else{
                        console.log("Login Failed");
                        resolve({status:false})

                    }
                       
                })
            }else{
                console.log("Login Failed");
                resolve({status:false})
            }
        })
    },

    addtoCart:(proId,userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==proId,user=> user==userId)
                console.log(proExist);
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION).updateOne({'products.item': objectId(proId),'user':objectId(userId)},
                    
                    
                    
                    
                    
                    
                    {
                        $inc:{'products.$.quantity':1}
                    }).then(()=>{
                        resolve()
                    })
                }else{
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                {
                    $push:{products:proObj}
                }).then((response)=>{
                    resolve()
                })

            }}else{
                let cartObj={
                    user:objectId(userId),
                    products:[
                        proObj
                    ]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()

                })
            }

        })

    },

    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}




                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                }
                
            ]).toArray()
            // console.log(cartItems[0].products);
            resolve(cartItems)
        })
    },

    getCartCount:(userId)=>{

        return new Promise(async (resolve,reject)=>{
            let count=0
            let cart= await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart){
                count=cart.products.length
            } resolve(count)
        })

    }
}