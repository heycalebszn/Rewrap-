#!/bin/bash
set -e

TEST_DIR="test-project-$(date +%s)"

# Test New Installation
echo "Testing new project creation..."
mkdir $TEST_DIR
cd $TEST_DIR
npm link rewrapped
rewrapped << ANSWERS
new
test-project
react
typescript
yes
lucide-react
all
yes
ANSWERS

echo "Checking results..."
[ -f "tailwind.config.js" ] || (echo "Tailwind config missing!" && exit 1)
[ -d "src/components" ] || (echo "Components missing!" && exit 1)

# Cleanup
cd ..
rm -rf $TEST_DIR

echo "All tests passed!"