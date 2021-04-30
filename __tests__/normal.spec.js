const {
  executeUnprotected: runner,
  normalDbPath
} = require('../helpers/runner');
const fs = require('fs');

const firstTodo = 'Todo #1'

afterAll(() => fs.unlinkSync(normalDbPath));

describe("CLI non-interactive mode", () => {
  test("It should show usage menu", () => {
    return runner(['help'])
      .then(result => {
        const { stdOut, stdErr } = result;
        expect(result).toHaveProperty('stdOut');
        expect(result).toHaveProperty('stdErr');
        expect(stdOut).not.toBeNull();
        expect(stdErr).toEqual('');
        expect(stdOut).toContain('Todo helps you manage your tasks.')
      })
  });
  test("It should add new todo", () => {
    return runner(['new', firstTodo])
      .then(result => {
        const { stdOut, stdErr } = result;
        expect(result).toHaveProperty('stdOut');
        expect(result).toHaveProperty('stdErr');
        expect(stdOut).not.toBeNull();
        expect(stdErr).toEqual('');
        expect(stdOut).toContain('Done.')
      })
  });
  test("It should list all todos", () => {
    return runner(['ls'])
      .then(result => {
        const { stdOut, stdErr } = result;
        expect(result).toHaveProperty('stdOut');
        expect(result).toHaveProperty('stdErr');
        expect(stdOut).not.toBeNull();
        expect(stdErr).toEqual('');
        expect(stdOut).toContain('Test todo 1 ✗\n')
      });
  });
  test("It should mark todo as complete", () => {
    return runner(['done', '1'])
      .then(result => {
        const { stdOut, stdErr } = result;
        expect(result).toHaveProperty('stdOut');
        expect(result).toHaveProperty('stdErr');
        expect(stdOut).not.toBeNull();
        expect(stdErr).toEqual('');
        // Uncomment below line to check for output equality with ctrl characters.
        // expect(stdOut).toEqual('\x1B[32m Done.\n')
        expect(stdOut).toContain('Done.')
      });
  });
  test("It should list todo with done mark", () => {
    return runner(['ls'])
      .then(result => {
        const { stdOut, stdErr } = result;
        expect(result).toHaveProperty('stdOut');
        expect(result).toHaveProperty('stdErr');
        expect(stdOut).not.toBeNull();
        expect(stdErr).toEqual('');
        expect(stdOut).toContain('Test todo 1 ✓\n')
      });
  });
  test("It should show invalid command error", () => {
    return runner(['lsx'])
      .then(result => {
        const { stdOut, stdErr } = result;
        expect(result).toHaveProperty('stdOut');
        expect(result).toHaveProperty('stdErr');
        expect(stdOut).toEqual('');
        // Uncomment below line to test control characters
        // expect(stdErr).toEqual('\x1B[31m Invalid command passed. Use "todo help" for available options\n');
        expect(stdErr).toContain('Invalid command passed')
      });
  });
});

// describe("CLI interactive mode", () => {
//   test("It should show usage menu", () => {
//     return runner(['interactive'])
//       .then(result => {
//         const { stdOut, stdErr } = result;
//         expect(result).toHaveProperty('stdOut');
//         expect(result).toHaveProperty('stdErr');
//         expect(stdOut).not.toBeNull();
//         expect(stdErr).toEqual('');
//         expect(stdOut).toContain('Add todo.')
//       })
//   });
// });