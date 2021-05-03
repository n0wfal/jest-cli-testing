const fs = require("fs");

const config = require("../config");
const {
  executeProtected: execute,
  protectedDbPath,
  spawnObfuscated: spawn,
} = require("../helpers/runner");

const firstTodo = "First Todo";
const secondTodo = "Second Todo";

afterAll(() => {
  if (fs.existsSync(protectedDbPath)) fs.unlinkSync(protectedDbPath);
});

describe("CLI non-interactive mode", () => {
  test("It should show usage menu.", () => {
    return execute(["help"]).then((result) => {
      const { stdOut, stdErr } = result;
      expect(result).toHaveProperty("stdOut");
      expect(result).toHaveProperty("stdErr");
      expect(stdOut).not.toBeNull();
      expect(stdErr).toEqual("");
      expect(stdOut).toContain("Todo helps you manage your tasks.");
    });
  });

  test("It should add new todo.", () => {
    return execute(["new", firstTodo]).then((result) => {
      const { stdOut, stdErr } = result;
      expect(result).toHaveProperty("stdOut");
      expect(result).toHaveProperty("stdErr");
      expect(stdOut).not.toBeNull();
      expect(stdErr).toEqual("");
      expect(stdOut).toContain("Done.");
    });
  });

  test("It should list all todos.", () => {
    return execute(["ls"]).then((result) => {
      const { stdOut, stdErr } = result;
      expect(result).toHaveProperty("stdOut");
      expect(result).toHaveProperty("stdErr");
      expect(stdOut).not.toBeNull();
      expect(stdErr).toEqual("");
      expect(stdOut).toContain(firstTodo);
    });
  });

  test("It should mark todo as complete.", () => {
    return execute(["done", "1"]).then((result) => {
      const { stdOut, stdErr } = result;
      expect(result).toHaveProperty("stdOut");
      expect(result).toHaveProperty("stdErr");
      expect(stdOut).not.toBeNull();
      expect(stdErr).toEqual("");
      // Uncomment below line to check for output equality with ctrl characters.
      // expect(stdOut).toEqual('\x1B[32m Done.\n')
      expect(stdOut).toContain("Done.");
    });
  });

  test("It should list todo with done mark.", () => {
    return execute(["ls"]).then((result) => {
      const { stdOut, stdErr } = result;
      expect(result).toHaveProperty("stdOut");
      expect(result).toHaveProperty("stdErr");
      expect(stdOut).not.toBeNull();
      expect(stdErr).toEqual("");
      expect(stdOut).toContain(firstTodo);
    });
  });

  test("It should show invalid command error.", () => {
    return execute(["lsx"]).catch((e) => {
      expect(e.code).toEqual(1);
    });
  });
});

describe("CLI interactive mode", () => {
  test("It should show prompt.", (done) => {
    const interactiveCli = spawn(["interactive"]);
    let stdOutData;
    interactiveCli.stdout.on("data", (data) => {
      stdOutData += data.toString();
    });
    interactiveCli.stdout.on("end", () => {
      expect(stdOutData).toContain("What do you want to do?");
      done();
    });
    interactiveCli.stderr.on("data", (data) => done(data.toString()));
    interactiveCli.on("error", (err) => done(err));
    interactiveCli.stdin.write("\x03"); // Scan code for CTRL-C
    interactiveCli.stdin.end();
  });
  test(
    "It should add new todo.",
    (done) => {
      const interactiveCli = spawn(["interactive"]);
      let stdOutData;
      interactiveCli.stdout.on("data", (data) => {
        stdOutData += data.toString();
      });
      interactiveCli.stderr.on("data", (data) => done(data.toString()));
      setTimeout(() => {
        interactiveCli.stdin.write("\x0D");
      }, 1000);
      setTimeout(() => {
        interactiveCli.stdin.write(secondTodo);
      }, 1500);
      setTimeout(() => {
        interactiveCli.stdin.write("\x0D");
      }, 2000);
      setTimeout(() => {
        interactiveCli.stdin.end();
      }, 2500);
      interactiveCli.on("error", (err) => done(err));
      interactiveCli.on("exit", () => {
        expect(stdOutData).toContain("Done.");
        done();
      });
    },
    config.forever // This might take a while.
  );
  test(
    "It should show todos.",
    (done) => {
      const interactiveCli = spawn(["interactive"]);
      let stdOutData;
      interactiveCli.stdout.on("data", (data) => {
        stdOutData += data.toString();
      });
      interactiveCli.stdin.setDefaultEncoding("ascii");
      setTimeout(() => {
        interactiveCli.stdin.write("72");
      }, 1000);
      setTimeout(() => {
        interactiveCli.stdin.write("72");
      }, 1500);
      setTimeout(() => {
        interactiveCli.stdin.write("\x0D");
      }, 2000);
      setTimeout(() => {
        interactiveCli.stdin.end();
      }, 2500);
      interactiveCli.stderr.on("data", (data) => done(data.toString()));
      interactiveCli.on("error", (err) => done(err));
      interactiveCli.on("exit", () => {
        expect(stdOutData).toContain(firstTodo);
        expect(stdOutData).toContain(secondTodo);
        done();
      });
    },
    config.forever
  );
});
