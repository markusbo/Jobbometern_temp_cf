#!/bin/bash

for filename in upload/*.json; do
   echo "upload $filename"
   wrangler kv:bulk put --binding=EMPLOYER $filename
done
