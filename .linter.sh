#!/bin/bash
cd /home/kavia/workspace/code-generation/cinematch-arena-35573-8381c08f/cinematch_arena
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

