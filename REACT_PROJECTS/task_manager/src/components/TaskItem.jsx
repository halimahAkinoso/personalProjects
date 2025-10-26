import { useState } from 'react';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  
  function handleEdit() {
    if (editText.trim() === '') return;
    onEdit(task.id, editText);
    setIsEditing(false);
  }
  
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
          autoFocus
        />
      ) : (
        <span onClick={() => setIsEditing(true)}>{task.text}</span>
      )}
      
      <button onClick={() => onDelete(task.id)} className="delete-btn">
        🗑️
      </button>
    </div>
  );
}

export default TaskItem;
