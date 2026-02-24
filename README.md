# Tuesday MCP: Multi-Agent Workflow Guide

Tuesday is an AI-first Project Management (PM) platform that exposes an MCP (Model Context Protocol) server. By adding Tuesday as an MCP server to your agents, they can use it as a centralized "brain" or Kanban board to coordinate, plan, and track progress autonomously.

## Core Capabilities

The Tuesday MCP gives agents access to a full PM suite through tools:
- **Projects**: The top-level containers (`create-project`, `get-project`, `list-projects`, `update-project`, `delete-project`).
- **Pipelines**: The columns or stages within a project, like "To Do", "In Progress", "Code Review", "Done" (`create-pipeline`, `update-pipeline`, `delete-pipeline`).
- **Tasks**: The actual units of work, assigned to specific pipelines (`create-task`, `get-task`, `update-task`, `move-task`, `delete-task`).

## How to use it for Multi-Agent Workflows

Using Tuesday, you can create a highly structured multi-agent workflow where different specialized agents coordinate asynchronously:

### 1. The "Planner" Agent (Initialization)
- A Planner agent is given a high-level goal by the user (e.g., "Build a new landing page").
- **Action**: It uses `create-project` to initialize a new PM board.
- **Action**: It uses `create-pipeline` to create stages: "Backlog", "Design", "Development", "Testing", "Done".
- **Action**: It breaks down the goal and uses `create-task` to populate the "Backlog" pipeline with concrete tasks.

### 2. The Specialized "Worker" Agents (Execution)
- You can have multiple specialized agents (e.g., a Designer agent, a Frontend Developer agent, a QA agent) running in parallel or triggered periodically.
- **Action**: A Worker agent uses `list-projects` and then queries the relevant project's pipelines to find tasks it can pick up.
- **Action**: When a Frontend Developer agent picks up a task from the "Development" pipeline, it uses `update-task` to set the `assignee` to itself and `move-task` to move it to an "In Progress" pipeline.
- **Action**: Upon finishing the code, it uses `move-task` to push it to the "Testing" pipeline.

### 3. The "Reviewer / QA" Agent (Validation)
- **Action**: A QA agent polls the "Testing" pipeline.
- **Action**: It reads the `description` and `title` of the task using `get-task`, checks the work, and then either uses `move-task` to push it to "Done", or moves it back to "Development" with a comment/update in the task description.

### 4. The "Manager" Agent (Reporting)
- **Action**: A reporting agent can periodically use `get-project` and read all tasks to generate a summary report for the human user.

## Benefits of using Tuesday MCP for Agents
1. **Shared State**: Agents don't need to pass massive context windows to each other. They just read the state from the Tuesday DB (`better-sqlite3`).
2. **Asynchronous Handoffs**: An agent can finish its job and safely terminate. The next agent just reads the board to know what to do next.
3. **Human Oversight**: Because Tuesday is built as a Nuxt application, you (the human) can open `http://localhost:3000` to visually see exactly what the agents are planning and doing in real-time.

## Example Workflow Scenario

1. **User**: "Please build an authentication system. Use Tuesday to manage the work."
2. **Agent A (Planner)**: 
   - `create-project({ name: 'Auth System' })` -> returns `project_id`
   - `create-pipeline({ projectId: '...', name: 'To Do', order: 0 })`
   - `create-pipeline({ projectId: '...', name: 'In Progress', order: 1 })`
   - `create-pipeline({ projectId: '...', name: 'Done', order: 2 })`
   - `create-task({ projectId: '...', pipelineId: '[To Do ID]', title: 'Setup DB schema for users' })`
   - `create-task({ projectId: '...', pipelineId: '[To Do ID]', title: 'Create login page UI' })`
3. **Agent B (Backend Developer)**:
   - Sees the "Setup DB schema" task. 
   - `move-task({ taskId: '...', pipelineId: '[In Progress ID]' })`
   - *Writes the code...*
   - `move-task({ taskId: '...', pipelineId: '[Done ID]' })`
4. **Agent C (Frontend Developer)**:
   - Picks up the "Create login page UI" task and repeats the process.
