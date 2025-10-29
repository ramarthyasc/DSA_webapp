exports.questionsList = ["trapping-rain-water", "is-palindrome", "three-integer-sum"];

exports.questionDetailsList = {
  "trapping-rain-water": {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description: "You are given an array of non-negative integers height which represent an elevation map. Each value height[i] represents the height of a bar, which has a width of 1." +
      "\n\n Return the maximum area of water that can be trapped between the bars.",
    examples: [
      {
        id: 0,
        title: "Example 1",
        input: "height = [0,2,0,3,1,0,1,3,2,1]",
        output: "9",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= height.length <= 1000",
      "0 <= height[i] <= 1000",
    ],
    tips: [
      {
        title: "Recommended Time & Space Complexity",
        description: "You should aim for a solution as good or better than O(n) time and O(n) space, where n is the size of the input array.",
      },

      {
        title: "Hint 1",
        description: "Visualize each height as a block, and derive a mathematical formula to find the height of water each block can hold",
      }
    ],
  },

  "is-palindrome": {
    id: "is-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    description: "Given a string s, return true if it is a palindrome, otherwise return false." +
      "\n\n A palindrome is a string that reads the same forward and backward. It is also case-insensitive and ignores all non-alphanumeric characters." +
      "\n\n Note: Alphanumeric characters consist of letters(A- Z, a - z) and numbers(0 - 9).",
    examples: [
      {
        id: 0,
        title: "Example 1",
        input: "s = \"Was it a car or a cat I saw?\"",
        output: "true",
        explanation: "After considering only alphanumerical characters we have \"wasitacaroracatisaw\", which is a palindrome."
      },
      {
        id: 1,
        title: "Example 2",
        input: "s = \"tab a cat\"",
        output: "false",
        explanation: "\"tabacat\" is not a palindrome."
      }
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s is made up of only printable ASCII characters.",
    ],
    tips: [
      {
        title: "Recommended Time & Space Complexity",
        description: "You should aim for a solution with O(n) time and O(1) space, where n is the length of the input string.",
      },

      {
        title: "Hint 1",
        description: "A brute force solution would be to create a copy of the string, reverse it, and then check for equality." +
          "This would be an O(n) solution with extra space. Can you think of a way to do this without O(n) space?",
      },
    ],
  },

  "three-integer-sum": {
    id: "three-integer-sum",
    title: "3 Sum",
    difficulty: "Medium",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] where nums[i] + nums[j] + nums[k] == 0," +
      "and the indices i, j and k are all distinct." +
      "\n\n The output should not contain any duplicate triplets. You may return the output and the triplets in any order.",
    examples: [
      {
        id: 0,
        title: "Example 1",
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0." +
          "\n nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0." +
          "\n nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0." +
          "\n The distinct triplets are [-1,0,1] and [-1,-1,2]."
      },
      {
        id: 1,
        title: "Example 2",
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "The only possible triplet does not sum up to 0."
      },
      {
        id: 2,
        title: "Example 3",
        input: "nums = [0,0,0]",
        output: "[[0,0,0]]",
        explanation: "The only possible triplet sums up to 0."
      }
    ],
    constraints: [
      "3 <= nums.length <= 1000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    tips: [
      {
        title: "Recommended Time & Space Complexity",
        description: "You should aim for a solution with O(n^2) time and O(1) space, where n is the size of the input array.",
      },

      {
        title: "Hint 1",
        description: "A brute force solution would be to check for every triplet in the array. This would be an O(n^3) solution." +
          "Think of a better way.",
      },
    ],
  }

}
