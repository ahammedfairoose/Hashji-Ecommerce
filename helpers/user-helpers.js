var db=require('../config/connection');
var collection=require('../config/collections');
const bcrypt=require('bcrypt');
const async = require('hbs/lib/async');
const { response } = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const { reject } = require('bcrypt/promises');
var objectId=require('mongodb').ObjectId;
const { ObjectId } = require('mongodb');
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
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                {
                    $push:{products:objectId(proId)}
                }).then((response)=>{
                    resolve()
                })

            }else{
                let cartObj={
                    user:objectId(userId),
                    products:[
                        objectId(proId)
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




                },{
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let :{prodList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$prodList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }





                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
}