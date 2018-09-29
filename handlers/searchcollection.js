'use strict';

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition({
  apiVersion: '2016-06-27'
});

exports.handler = (event, context, callback) => {
  // console.log("event:::"+ JSON.stringify(event));
  let bucket = event.Records[0].s3.bucket.name;
  let key = event.Records[0].s3.object.key;

  const params = {
    CollectionId: "MISSING_PERSONS_COLLECTION", 
    FaceMatchThreshold : 90,
    Image: { /* required */
      //   Bytes: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
      S3Object: {
        Bucket: bucket,
        Name: key,
        // Version: 'STRING_VALUE'
      }
    },
    MaxFaces: 10
  }

  console.log("  >>>>params:::" + JSON.stringify(params));

  /*Real Code*/
  const searchFacesRes = params => {
    return new Promise((resolve, reject) => {
      rekognition.searchFacesByImage(params, (err, data) => {
        if (err) reject(err);
       else resolve(data);
      })
    })
  }
  

  searchFacesRes(params)
  .then(data => console.log("Search Faces Response>>"+ JSON.stringify(data)))
  // .then(createRekogCollection)
  // .then(data => console.log("Rekognition Response>>"+ JSON.stringify(data)))
  .catch(err => console.log("Error Response >>"+ JSON.stringify(err)) );

} 