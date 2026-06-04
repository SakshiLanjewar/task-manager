import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { STATUS_CONFIG } from "../utils/constants";

/**
 * KanbanColumn — one of the three status columns on the board.
 * Wraps @hello-pangea/dnd Droppable + Draggable for smooth
 * drag-and-drop reordering within and across columns.
 */
function KanbanColumn({ statusId, tasks, onEdit }) {
  const config = STATUS_CONFIG[statusId];

  return (
    <div className="kanban-column">
      {/* Column header with gradient accent */}
      <div className="column-header" style={{ background: config.gradient }}>
        <span className="column-emoji">{config.emoji}</span>
        <span className="column-title">{config.label}</span>
        <span className="column-count">{tasks.length}</span>
      </div>

      {/* Droppable zone */}
      <Droppable droppableId={statusId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-body ${snapshot.isDraggingOver ? "drag-over" : ""}`}
            style={{
              background: snapshot.isDraggingOver ? config.lightBg : "transparent",
              transition: "background 0.2s ease",
            }}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="empty-column">
                <span>Drop tasks here</span>
              </div>
            )}

            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(prov, snap) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEdit}
                      dragHandleProps={prov.dragHandleProps}
                      isDragging={snap.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;
