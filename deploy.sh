#!/bin/sh

. ./credentials.sh

aws s3 mb s3://s3-deploymentbucket-missing-persons
aws rekognition create-collection --collection-id "MISSING_PERSONS_COLLECTION"
# sam package --template-file template.yaml --s3-bucket mybucket-adhadkar --output-template-file packaged.yaml
# sam deploy --template-file ./packaged.yaml --stack-name mystack-adhadkar --capabilities CAPABILITY_IAM


aws cloudformation package --template-file template.yaml --s3-bucket s3-deploymentbucket-missing-persons --output-template-file packaged.yaml
aws cloudformation deploy --template-file ./packaged.yaml --stack-name missing-persons --capabilities CAPABILITY_IAM