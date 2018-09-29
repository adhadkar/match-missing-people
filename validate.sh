#!/bin/sh

export AWS_ACCESS_KEY_ID=AKIAJY2B3SXYDFHR7FCQ
export AWS_SECRET_ACCESS_KEY=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

aws s3 mb s3://deploymentbucket-missing-persons
sam validate