export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}