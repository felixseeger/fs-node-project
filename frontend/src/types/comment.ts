export interface Comment {
  id?: string;
  workflowId: string;
  userId: string;
  content: string;
  createdAt?: Date | number;
  updatedAt?: Date | number;
}
