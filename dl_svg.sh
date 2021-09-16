#!/bin/bash

curl -sS $1 \
  | sed 's/>/>\n/g' \
  | sed 's/<!--.*-->//' \
  | sed '/<!--/,/-->/d' \
  | sed 's/  */ /g' \
  | tr -d '\n'
