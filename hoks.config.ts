import { defineConfig } from "hoks";

export default defineConfig({
    installOnLockChange: true,
    commitMessage: false,
    preCommit: [],
    preventCommit: false,
    syncBeforePush: false,
    enforceConventionalCommits: true,
    noTodos: false,
    testChanged: true,
    debug: false,
});
