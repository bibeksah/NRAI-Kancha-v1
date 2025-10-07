# Test Markdown Rendering

This file tests if the markdown preprocessing works correctly.

## Test Case 1: Heading after text
Some text here. ### This should be a heading
And this should be a paragraph.

## Test Case 2: Multiple headings
First paragraph. ### First Heading
Some content. ### Second Heading
More content here.

## Test Case 3: Proper markdown
This is done correctly.

### Proper Heading 1

Content under heading 1.

### Proper Heading 2

Content under heading 2.

## Expected Results:
- All ### markers should render as H3 headings
- Proper spacing should be added automatically
- No ### symbols should be visible in the output
