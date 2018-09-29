'use strict';


const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

exports.handler = (event, context, callback) => {
    // console.log("event:::"+ JSON.stringify(event));
    let bucket = event.Records[0].s3.bucket.name ;
    let key = event.Records[0].s3.object.key ;

    var params = {
        Image: { /* required */
        //   Bytes: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
          S3Object: {
            Bucket: bucket,
            Name: key,
            // Version: 'STRING_VALUE'
          }
        },
        Attributes: [
          "ALL"
          /* more items */
        ]
      };

      console.log("  >>>>params:::"+ JSON.stringify(params));
  
    rekognition.detectFaces(params, (err, data) => {
        if (err) {
          callback(null, err);
        } else {
          
          callback(null, console.log("Rekognition Response>>"+ JSON.stringify(data)));
        }
    
      });

}