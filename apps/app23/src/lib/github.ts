import { Octokit } from 'octokit'

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
})

const OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER
const REPO = import.meta.env.VITE_GITHUB_REPO_NAME

export type GitHubIssue = {
  id: number
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed'
  labels: { name: string; color: string }[]
  assignee: { login: string; avatar_url: string } | null
  created_at: string
  comments: number
}

export const fetchIssues = async (): Promise<GitHubIssue[]> => {
  const { data } = await octokit.rest.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'all',
    per_page: 50,
    sort: 'updated'
  })
  return data.filter(issue =>!issue.pull_request) as GitHubIssue[]
}

export const updateIssue = async (issueNumber: number, labels: string[]) => {
  return octokit.rest.issues.update({
    owner: OWNER,
    repo: REPO,
    issue_number: issueNumber,
    labels
  })
}

export const createIssue = async (title: string, body: string) => {
  return octokit.rest.issues.create({
    owner: OWNER,
    repo: REPO,
    title,
    body
  })
}