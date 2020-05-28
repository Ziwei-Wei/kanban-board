## Kanban

### Introduction

#### Trello like drag and drop function made by pure native HTML Drag and Drop API in React.js. Used JWT authentication to persist session and secure user info, will auto refresh token every 15 minutes. Used MongoDB Atlas as backend and mongoose in express.js to handle structured data, and hanlde blob data locally. Used webpack to compile both frontend and backend code to ./dist to deploy and setup powerful toolchain using eslint, stylelint, babel, storybook, etc. to support development.

#### note: the backend can support multi-kanban and access management, but I did not implement these in frontend due to the requirement. So all user will share the same kanban.

#### note: resumes are stored locally not in AWS S3 or Azure Storage, if you rebuild docker, they will get lost.

#### good to know: test user = {email: test@gmail.com, password: 123123123}

### Architecture

#### react.js <-> express.js(serves both web content and file uploads) <-> mongoDB Atlas(serves all structured data)

#### Because file uploads is handled in express.js server locally not in AWS S3 or Azure Storage, when you rebuild docker image all saved resume will be gone! be careful!

### Deployment scripts

#### ./build.sh --build to a docker image

#### ./run.sh --run the docker image

#### ./clean.sh --stop and remove all live containers

### Deployment commands
```console
 git clone https://github.com/Ziwei-Wei/kanban-board.git
 cd ./kanban-board/
 ./build.sh
 ./run.sh
```
### Open localhost:8080 to see the kanban
