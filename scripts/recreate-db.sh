#!/usr/bin/bash


if [ "$1" = "--local" ]; then
    ENV_PARAM=0
elif [ "$1" = "--prod" ]; then
    ENV_PARAM="--neon"
else
    echo "$0: A single option (--local or --prod) is required."
    exit 2
fi

bash changes/v0-0-1.sh "$ENV_PARAM"
bash changes/v0-0-3.sh "$ENV_PARAM"