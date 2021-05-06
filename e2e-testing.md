# **E2E Testing CLI Applications.**

## **3<sup>rd</sup> May 2021**

# OVERVIEW

The purpose of this document is to record the observations and findings noted during the research to find an appropriate tool/method to test CLI applications. Also taken into account is the fact that these CLI applications will be protected/obfuscated using **JSDefender** and hence the tests were done on both the obfuscated and non-obfuscated variants of the sample application.

# GOALS

1. Identify the best method to test CLI applications.
2. Support easy setup and teardown.
3. Chosen method should work on Github Actions.

# SETUP

The setup involved uses a custom CLI application that has minimal dependencies and one which can be easily obfuscated using **JSDefender**. The todos are saved to a json file. The CLI outputs the errors to stderr and output to stdout. In case of error the exit code is set to 1 and 0 on success like any normal applications.

The application works in both **interactive** and **non-interactive** modes. Both these modes will be tested.

# TOOLS/METHODS

## Vesln/Nixt

One of the readily available tools for testing CLI applications is [nixt](https://github.com/vesln/nixt). This was suggested in the PRD. The project isn’t actively maintained and the last commit was almost 2 years ago. It is evident from this fact that the project was not made with future versions of Node in mind and hence it failed to run on the LTS version of NodeJS (v14.16.0).

## Jest

Jest is a popular javascript testing framework and hence support for Jest is phenomenal. Jest was chosen over it’s alternatives like Mocha because Jest comes with batteries included and Mocha can be used when flexibility is needed. For testing the CLI applications Jest should be more than enough.

# TESTING

CLI applications can be categorized into two, interactive and non-interactive (more info [here](https://tldp.org/LDP/abs/html/intandnonint.html)). The sample application works in both interactive and non-interactive mode. In non interactive mode the command is called with the required arguments from the shell like `sample_cli new <todo>`. To invoke non-interactive mode the application is invoked with the `sample_cli interactive` flag.

### Jest Setup

Jest tests can be found in the tests folder. There are two files. **normal.spec.js** and **obfuscated.spec.js**. Each file is a test suite and the two suits have two sets of tests. One of the tests is for the interactive mode of the CLI and the second set of tests is for the non-interactive mode. The tests can be run using **npm run tests**

### Tests

#### Non-Interactive

The non-interactive tests are run using the `exec` function of NodeJS. A wrapper function for this can be found in the /helpers/runner.js file. The function monitors the standard output and standard error available at `stdout` and `stderr` variables.
The `stdout` is monitored for the output from the CLI and `stdErr` is monitored to check the application output for errors. Although it is not necessary to check the output from the stdout the option to check it using regex is available. It can also check for the presence of control characters in the output.

#### Interactive

The interactive tests are run using the `spawn` function of NodeJS. The wrapper function is available in the helpers/runner.js file. The function launches the cli in a separate shell. While in interactive mode jest tests write to the child applications standard input, **stdin**. Keystrokes are sent to the application. This way the tests can automate the interaction with the CLI.
At the moment the keystrokes are using a settimeout function but this can be refactored to use another stream that feeds the stdin of the child process and hence settimeout can be removed.

#### Obfuscated

The obfuscated version of the CLI application can be found in the bin/obfuscated.js file. Inside the test files. The same set of tests are run for the obfuscated version of the code as well. This ensures that the obfuscated version behaves in the same way as the normal version.

# GITHUB ACTIONS

A basic github actions workflow was set up to ensure that the tests were working fine on Githubs CI servers. The tests were successful as of writing this document.

# CONCLUSION

From the above testing it is clear that writing tests Jest is capable of writing unit tests for CLI applications, both interactive and non-interactive. Although the tests in the sample application could use some improvement it is the right way to go. There is minimum overhead from additional test dependencies and Jest is capable of mocking the stdin and stdout which can make the testing easier for interactive applications.

Under the hood tools like Nixt use the same core module called childProcess to spawn new applications and plug into their stdin to provide input and stdout to validate results. Currently the tests in the sample application are quite verbose. The reason for this is that the tests are monitoring the response on the stdout.

For End to End tests we should be more concerned about the final result. Which can be found in the exit code, the side effects caused by the CLI, in the sample application testing the json file.

Take for example testing the **cp** command. The file system should be set up in memory or mocked. \
Use the childProcess module to spawn the **cp** command along with the arguments. Assert things about the filesystem (new files have been created in the path or not). Once done, tear down the mocked file system.

All errors in the above case can be hidden behind the `exec` or `spawn` methods of the file system. If the actual modules are failing their implementations, this can be captured at the unit test/integration testing levels. The actual end to end test makes sure that typing in the command inside the terminal creates the expected result, for **cp** running the command actually duplicates the file.

Alternatives do exist in other languages like pytest and BATS. At the end of the day they do the same thing which JEST does. It is better to stick with JavaScript for testing JavaScript.
