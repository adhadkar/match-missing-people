#!/bin/sh

. ./credentials.sh

aws rekognition list-faces --collection-id "MISSING_PERSONS_COLLECTION"
# aws rekognition delete-collection --collection-id "MISSING_PERSONS_COLLECTION"
