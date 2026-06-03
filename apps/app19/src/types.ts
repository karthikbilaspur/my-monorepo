export type TestCase = {
  id: string
  input: string
  expected: string
  hidden?: boolean
}

export type Problem = {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  testCases: TestCase[]
  starterCode: Record<string, string> // language -> code
  tags: string[]
}

export type Submission = {
  id: string
  problemId: string
  code: string
  language: string
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit'
  runtime: number
  timestamp: number
  passedTests: number
  totalTests: number
}

export type TestResult = {
  testCaseId: string
  passed: boolean
  input: string
  expected: string
  actual: string
  error?: string
  runtime: number
}