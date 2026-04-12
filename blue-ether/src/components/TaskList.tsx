import { motion, AnimatePresence } from "framer-motion";
import type { RootState, AppDispatch } from "../lib/store";

import Task from "./Task";
import { Button } from "./Button";

import "./task-list.css";

import { useDispatch, useSelector } from "react-redux";

import { updateTaskState, fetchTasks } from "../lib/store";

export default function TaskList() {
  // We're retrieving our state from the store
  const tasks = useSelector((state: RootState) => {
    const tasksInOrder = [
      ...state.taskbox.tasks.filter((t) => t.state === 'TASK_PINNED'),
      ...state.taskbox.tasks.filter((t) => t.state !== 'TASK_PINNED'),
    ];
    const filteredTasks = tasksInOrder.filter(
      (t) => t.state === "TASK_INBOX" || t.state === "TASK_PINNED"
    );
    return filteredTasks;
  });
  const { status } = useSelector((state: RootState) => state.taskbox);
  const dispatch = useDispatch<AppDispatch>();
  const pinTask = (value: string) => {
    // We're dispatching the Pinned event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_PINNED' }));
  };
  const archiveTask = (value: string) => {
    // We're dispatching the Archive event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_ARCHIVED' }));
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );

  if (status === "loading") {
    return (
      <div className="list-items" data-testid="loading" key="loading">
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="list-items" key="error" data-testid="error">
        <div className="wrapper-message">
          <span className="icon-star" style={{ color: 'var(--be-color-error)', fontSize: 48, marginBottom: 16, display: 'block' }} />
          <p className="title-message">Something went wrong</p>
          <p className="subtitle-message">Failed to load tasks</p>
          <Button 
            variant="secondary" 
            style={{ marginTop: 16 }}
            onClick={() => dispatch(fetchTasks())}
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="list-items" key="empty" data-testid="empty">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="wrapper-message"
          style={{ position: 'absolute', top: '45%', left: 0, right: 0, textAlign: 'center', transform: 'translateY(-50%)' } as any}
        >
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="list-items" data-testid="success" key="success">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onPinTask={pinTask}
            onArchiveTask={archiveTask}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}