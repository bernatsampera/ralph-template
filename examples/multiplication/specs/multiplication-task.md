# Multiplication Task Specification

## Overview

The AI agent must read number pairs from input files, multiply them, and write the results to output files.

## Input Format

- **Location**: `input/` folder
- **File format**: Plain text (`.txt`)
- **Content**: Two integers, one per line

Example input file:
```
5
3
```

## Output Format

- **Location**: `output/` folder
- **File format**: Plain text (`.txt`)
- **Content**: Single integer (the product of the two input numbers)

Example output file:
```
15
```

## Test Cases

| Input File | Number 1 | Number 2 | Expected Output | Output File |
|------------|----------|----------|-----------------|-------------|
| input/001.txt | 5 | 3 | 15 | output/001.txt |
| input/002.txt | 7 | 4 | 28 | output/002.txt |
| input/003.txt | 10 | 2 | 20 | output/003.txt |

## Acceptance Criteria

1. All three output files must exist
2. Each output file must contain the correct product
3. Output files must have the same filename as their corresponding input files
4. Output must be a single integer with no extra whitespace or formatting

## Validation

To verify completion, check that:
- `output/001.txt` contains `15`
- `output/002.txt` contains `28`
- `output/003.txt` contains `20`
