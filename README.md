# TODO CLI

A CLI application built with Node JS and minimal dependencies.

## Setup & Installation.

1. Clone the repository using `git clone https://github.com/n0wfal/jest-cli-testing.git`
2. Install dependencies using `npm install`
3. Run the application using `node bin/index.js`
4. Install globally using `npm install -g .` and launch from shell using command `sample_cli`

## Usage

`sample_cli <command>`

## Available Commands

- `help` To show the usage menu.
- `new <todo>` To add a new todo with default status as `done: false`
- `list` To show all the todos in the format `<todo id> <todo text> <status checkmark>`
- `mark <id>` To mark a todo as done.
- `interactive` To start the application in interactive mode.

## Uninstallation

`npm uninstall -g .`

## Tests

`npm run test` to run the tests.

- [ ] Improve code coverage
