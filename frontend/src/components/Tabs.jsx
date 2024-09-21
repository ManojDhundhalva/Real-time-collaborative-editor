import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/material";

const Tabs = (props) => {
  const { tabs, setTabs, selectedFileId, handleCloseTab, handleFileClick } =
    props;

  // Function to handle the end of a drag event
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If there's no destination, do nothing
    if (!destination) return;

    // Reorder the tabs array
    const reorderedTabs = Array.from(tabs);
    const [movedTab] = reorderedTabs.splice(source.index, 1);
    reorderedTabs.splice(destination.index, 0, movedTab);

    setTabs(reorderedTabs);
  };

  return (
    <Grid sx={{ bgcolor: "lavender" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                display: "flex",
                overflow: "auto",
                ...provided.droppableProps.style,
              }}
            >
              {tabs.map((tab, index) => (
                <Draggable key={tab.id} draggableId={tab.id} index={index}>
                  {(provided) => (
                    <div
                      onClick={() => {
                        handleFileClick(tab);
                      }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: "6px",
                        border: "1px solid black",
                        background:
                          selectedFileId === tab.id ? "lightblue" : "lightgrey",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <span>{tab.name}</span>
                      <IconButton
                        size="small"
                        aria-label="close"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTab(tab.id);
                        }}
                        sx={{ marginLeft: 1 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Grid>
  );
};

export default Tabs;
