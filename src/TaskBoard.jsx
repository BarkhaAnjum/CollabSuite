import React, { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


const pastelBlue = "bg-[#e7f0ff]";
const pastelPurple = "bg-[#f0e7ff]";
const pastelSky = "bg-[#e7faff]";

const initialData = {
  columns: {
    todo: {
      name: "To Do",
      color: pastelBlue,
      items: [
        { id: "task-1", content: "Design homepage layout" },
        { id: "task-2", content: "Fix dashboard alignment" },
      ],
    },
    progress: {
      name: "In Progress",
      color: pastelPurple,
      items: [
        { id: "task-3", content: "API integration for docs" },
      ],
    },
    done: {
      name: "Completed",
      color: pastelSky,
      items: [
        { id: "task-4", content: "User login flow" },
      ],
    },
  },
};

export default function TaskBoard() {
  const [data, setData] = useState(initialData);

  const handleDrag = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const startCol = data.columns[source.droppableId];
    const endCol = data.columns[destination.droppableId];

    const draggedItem = startCol.items[source.index];

    // Moving inside the same column
    if (startCol === endCol) {
      const newItems = Array.from(startCol.items);
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, draggedItem);

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: {
            ...startCol,
            items: newItems,
          },
        },
      };
      setData(newState);
      return;
    }

    // Moving to another column
    const startItems = Array.from(startCol.items);
    startItems.splice(source.index, 1);

    const endItems = Array.from(endCol.items);
    endItems.splice(destination.index, 0, draggedItem);

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [source.droppableId]: { ...startCol, items: startItems },
        [destination.droppableId]: { ...endCol, items: endItems },
      },
    };
    setData(newState);
  };

  const addTask = (colId) => {
    const content = prompt("Enter task details:");
    if (!content) return;

    const newTask = {
      id: "task-" + Date.now(),
      content,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [colId]: {
          ...data.columns[colId],
          items: [...data.columns[colId].items, newTask],
        },
      },
    };

    setData(newState);
  };

  return (
    <div className="w-full h-full overflow-auto p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Task Board
      </h1>

      <DragDropContext onDragEnd={handleDrag}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(data.columns).map(([colId, col]) => (
            <div
              key={colId}
              className={`rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700 ${col.color}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {col.name}
                </h2>
                <button
                  onClick={() => addTask(colId)}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white flex items-center gap-1"
                >
                  <Plus size={18} /> Add
                </button>
              </div>

              {/* DROPPABLE COLUMN */}
              <Droppable droppableId={colId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col gap-3 min-h-[200px]"
                  >
                    {col.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex items-center gap-2 cursor-grab active:scale-95 transition-transform"
                          >
                            <GripVertical size={18} className="text-gray-500" />
                            <span className="text-gray-800 dark:text-gray-200">
                              {item.content}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
