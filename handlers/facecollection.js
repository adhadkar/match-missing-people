'use strict';

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition({
  apiVersion: '2016-06-27'
});
const dynamo = new AWS.DynamoDB.DocumentClient();
const table = process.env.TABLE_NAME;

exports.handler = (event, context, callback) => {
  // console.log("event:::"+ JSON.stringify(event));
  let bucket = event.Records[0].s3.bucket.name;
  let key = event.Records[0].s3.object.key;

  const params = {
    CollectionId: "MISSING_PERSONS_COLLECTION", 
    Image: { /* required */
      //   Bytes: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
      S3Object: {
        Bucket: bucket,
        Name: key,
        // Version: 'STRING_VALUE'
      }
    }
    // ,
    // Attributes: [
    //   "ALL"
    //   /* more items */
    // ]
  };

  console.log("  >>>>params:::" + JSON.stringify(params));

  /*Real Code*/
  const createindexFaces = params => {
    return new Promise((resolve, reject) => {
      rekognition.indexFaces(params, (err, data) => {
        if (err) reject(err);
       else resolve(data);
      })
    })
  }
  
  /*Fake Response*/
  
  // const createindexFaces = params => {
  //   return new Promise((resolve) => {
  //     resolve({"FaceDetails": [
  //       {
  //           "BoundingBox": {
  //               "Width": 0.08636363595724106,
  //               "Height": 0.1536388099193573,
  //               "Left": 0.7671717405319214,
  //               "Top": 0.3504043221473694
  //         },"AgeRange": {
  //             "Low": 29,
  //             "High": 45
  //         },"Gender": {
  //           "Value": "Female",
  //           "Confidence": 99.99815368652344
  //       }
  //         }]
  //       });
  //   });
  // }
  
  const updateDynamodb = event => {
    return new Promise((resolve, reject) => {
      console.log("  >>>>event:::" + JSON.stringify(event));
      event.FaceRecords.forEach((face) => {
      const params = {TableName:table, Item:{
        "faceId": face.Face.FaceId,
        "imageId": face.Face.ImageId
        }
      };  
      dynamo.put(params, (err, data) => {
          if (err) {
            console.error("Unable to add row. Error JSON:", JSON.stringify(err, null, 2));
            reject(err);
          } 
          else {
            console.log("Added faceId:", JSON.stringify(data, null, 2));
            resolve(data)
          };
        });
      })
      
    })
  }

  createindexFaces(params)
  // .then(data => console.log("Rekognition Response>>"+ JSON.stringify(data)))
  .then(updateDynamodb)
  .then(data => console.log("Dynamodb Response>>"+ JSON.stringify(data)))
  .catch(err => console.log("Error Response>>"+ JSON.stringify(err)) );

} 