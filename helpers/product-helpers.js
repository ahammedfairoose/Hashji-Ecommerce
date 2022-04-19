var db=require('../config/connection');
var collection=require('../config/collections');
const async = require('hbs/lib/async');
const { reject } = require('bcrypt/promises');
const { response } = require('express');
var objectId=require('mongodb').ObjectId;

module.exports={
    addProduct:(product,callback)=>{
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data);
            callback(data.insertedId);

        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },

    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            console.log(proId);
            console.log(objectId(proId));
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })

        })
    },

    getProductDetail:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)

            })
        })

    },

    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{

                    Name:proDetails.Name,
                    Category:proDetails.Category,
                    Description:proDetails.Description,

                }}).then((response)=>{
                    resolve()
                })
            }
        )

    }
}
// collection.insert(objectToInsert, function(err){
//     if (err) return;
//     // Object inserted successfully.
//     var objectId = objectToInsert._id; // this will return the id of object inserted
//  });