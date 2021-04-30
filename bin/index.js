#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inq = require('inquirer');

// const commands = ['new', 'ls', 'done', 'help', '-i'];

// Name of the file to which todos should be stored.
const todoDB = process.env.NODE_ENV === 'TEST'
    ? 'todo_test_db.json'
    : 'todo_db.json';

const args = process.argv.slice(2);
const dbPath = path.join(__dirname, todoDB);
const red = "\x1b[31m";
const green = "\x1b[32m";
const white = "\x1b[37m";

let contents = {};
let todosLength = 0;

// used to log errors to stderr console in red color.
function errorLog(error) {
    console.error(red, error)
}

// used to log to stdout in green color.
function successLog(msg) {
    console.log(green, msg)
}

// Initializations.
const init = () => {
    const fileExists = fs.existsSync(dbPath);
    if (!fileExists) {
        fs.writeFileSync(dbPath, `{ }`, 'utf-8');
    }
    const fileContents = fs.readFileSync(dbPath);
    try {
        contents = JSON.parse(fileContents);
        todosLength = Object
            .keys(contents).length;
    } catch (error) {
        fs.writeFileSync(dbPath, `{ }`, 'utf-8');
    }
}

init();

const usage = function () {
    const usageText = `
    Todo helps you manage your tasks.
  
    usage:
      todo <command>
  
      commands can be:
  
      new:      used to create a new todo
      ls:      used to retrieve your todos
      done: used to mark a todo as complete
      help:     used to print the usage guide
    `
    successLog(usageText)
}

  // Check if the command is valid.
//   if (commands.indexOf(args[0]) == -1) {
//     errorLog('invalid command passed. Use "todo help" for valid commands"');
// }

//Add new todo
const newTodo = (todo) => {
    if (!todo && !args[1]) {
        errorLog('Todo is needed. Usage "todo new <task>".');
        return;
    }
    const data = {
        todo: todo || args.splice(1).join(' '),
        done: false
    }
    contents[++todosLength] = data;
    fs.writeFileSync(dbPath, JSON.stringify(contents, null, 4));
    successLog('Done.')
}

// List all todos.
const listTodos = () => Object
    .keys(contents)
    .map((c,_i) =>console.log(`${++_i}. ${contents[c].todo} ${
        contents[c].done 
        ? '\u2713'
        : '\u2717' 
        }`));

// Mark todo as complete.
const markComplete = (id) => {
    if(!id && !args[id] && isNaN(args[1])) {
        console.log(id);
        errorLog('Todo id not valid');
        return
    }
    const todoExists = id || contents[args[1]];
    if (!todoExists) {
        errorLog('Todo not found.');
        return;
    }
    contents[id || args[1]].done = true
    fs.writeFileSync(dbPath, JSON.stringify(contents, null, 4));
    successLog('Done.');
}

const interactiveAddTodo = async () => {
    const addTodoPrompt = inq.createPromptModule();
    const { todo } = await addTodoPrompt({
        type: 'input',
        name: 'todo',
        message: 'Enter todo here:'
    });
    newTodo(todo);
}

const interactiveMarkTodo = async () => {
    const markTodoPrompt = inq.createPromptModule();
    const allTodos = JSON.parse(fs.readFileSync(dbPath));
    const formattedTodos = Object.keys(allTodos).map(e => {
        if(allTodos[e].done === false) {
            return {
                name: allTodos[e].todo,
                value: e
            }
        }
    })
    .filter(Boolean);
    const { id } = await markTodoPrompt({
        type: 'checkbox',
        name: 'id',
        message: 'Select the todos to be marked done',
        choices: formattedTodos
    });
    markComplete(id)
}

const interactiveMenu = async () => {
    const menuPrompt = inq.createPromptModule();
    const { action } = await menuPrompt({
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
            {
                name: 'Add todo',
                value: 'add'
            },
            {
                name: 'Show todos',
                value: 'list'
            },
            {
                name: 'Mark todo as done',
                value: 'mark'
            },
            {
                name: 'Exit',
                value: 'exit'
            }
        ],
      });
      switch(action) {
          case 'add':
              interactiveAddTodo();
              break;
            case 'list':
                listTodos();
                break;
            case 'mark':
                interactiveMarkTodo();
                break
            case 'exit':
                successLog('Exiting.');
                break;
            default:
                successLog('Exiting.');
                break;
      }
}

if(args[0]) {
    switch (args[0]) {
        case 'help':
            usage();
            break
        case 'new':
            newTodo();
            break
        case 'ls':
            listTodos();
            break
        case 'done':
            markComplete();
            break
        case 'interactive':
            interactiveMenu()
            break
        default:
            errorLog('Invalid command passed. Use "todo help" for available options')
    }
}

module.exports = {
    todoDB,
    dbPath
}