#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

rm "$DIR/../cookies/createAccount.txt";
casperjs "$DIR/../createAccount.js" --cookies-file="$DIR/../cookies/createAccount.txt";
