#!/bin/bash
token=$(curl \
  --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"bgp","password":"test12"}' \
  http://$(getent hosts veracity_backend | awk '{ print $1 }'):3000/api/v1/oauth/token |\
  jq -r '.access_token')
echo "REACT_APP_AUTH_TOKEN=\"Bearer ${token}\"" > .env.local
npm start