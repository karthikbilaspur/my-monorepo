import { Problem } from '../types'

export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      { id: '1', input: '[[2,7,11,15], 9]', expected: '[0,1]' },
      { id: '2', input: '[[3,2,4], 6]', expected: '[1,2]' },
      { id: '3', input: '[[3,3], 6]', expected: '[0,1]', hidden: true },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here

}`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass`
    },
    tags: ['Array', 'Hash Table']
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.'
    ],
    testCases: [
      { id: '1', input: '[["h","e","l","l","o"]]', expected: '["o","l","l","e","h"]' },
      { id: '2', input: '[["H","a","n","n","a","h"]]', expected: '["h","a","n","n","a","H"]' }
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Modify s in-place

}`,
      python: `def reverse_string(s):
    # Modify s in-place
    pass`
    },
    tags: ['Two Pointers', 'String']
  }
]