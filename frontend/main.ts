// **********************************
// * Define Constants
// **********************************

const OPTIONS_SELECT_ID = "options-select";
const COMMAND_ARGUMENTS_ID = "command-arguments";
const INPUT_CONTAINER_ID = "input-container";

// Should refactor to grab list of available commands from server
import { COMMAND_OPTIONS_MAP, Command, Option } from "./constants";

// **********************************
// * Generate Form and Options
// **********************************

const form = document.createElement("form");
form.onsubmit = handleSubmit;

// Create select for shell commands
createCommandSelectElement(
  Object.keys(COMMAND_OPTIONS_MAP),
  form,
  handleCommandOptionChange
);

// Create select for command options
createOptionsSelectElement(
  COMMAND_OPTIONS_MAP.ls.options,
  OPTIONS_SELECT_ID,
  form
);

// Create input container for command arguments
createArgumentsInput(
  Object.keys(COMMAND_OPTIONS_MAP)[0],
  COMMAND_ARGUMENTS_ID,
  form
);

const inputContainer = document.createElement("div");
inputContainer.id = INPUT_CONTAINER_ID;
form.appendChild(inputContainer);

const submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Run Command";
form.appendChild(submitButton);

// Attach form to body and render default options
document.body.appendChild(form);

// **********************************
// * Create Output Container
// **********************************

const outputContainer = document.createElement("div");
outputContainer.id = "output-container";
const header = document.createElement("h2");
header.textContent = "Run command to see output here...";
outputContainer.appendChild(header);
document.body.appendChild(outputContainer);

// **********************************
// * Helper Functions
// **********************************

function createCommandSelectElement(
  commands: string[],
  form: HTMLFormElement,
  onchange: (event: Event) => void
) {
  const label = document.createElement("label");
  label.textContent = "Select command to run:";
  const commandSelect = document.createElement("select");
  commandSelect.name = "command";
  commandSelect.onchange = onchange;

  commands.forEach((command) => {
    const option = document.createElement("option");
    option.value = command;
    option.textContent = command;
    commandSelect.appendChild(option);
  });

  form.appendChild(label);
  form.appendChild(commandSelect);
}

function createOptionsSelectElement(
  options: Record<string, Option>,
  elementId: string,
  form: HTMLFormElement
) {
  const optionsSelect = document.createElement("select");
  optionsSelect.name = "options";
  optionsSelect.id = elementId;
  optionsSelect.multiple = true;
  optionsSelect.onchange = (event) => renderInputs(event, options);
  optionsSelect.size = 0;

  Object.entries(options).forEach(([option, { description }]) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionsSelect.size += 1;
    optionElement.textContent = `-${option} ${description}`;
    optionsSelect.appendChild(optionElement);
  });

  form.appendChild(optionsSelect);
}

function createArgumentsInput(
  defaultCommand: string,
  elementId: string,
  form: HTMLFormElement
) {
  const argumentsContainer = document.createElement("div");
  argumentsContainer.id = elementId;

  const command =
    COMMAND_OPTIONS_MAP[defaultCommand as keyof typeof COMMAND_OPTIONS_MAP];

  if (command.acceptsArguments) {
    const label = document.createElement("label");
    label.innerHTML = `Enter arguments for <code>${defaultCommand}</code>${
      command.requiresArguments ? " (required)" : ""
    }: `;
    argumentsContainer.appendChild(label);
    const input = document.createElement("input");
    input.name = "arguments";
    input.placeholder = "arguments";
    input.required = command.requiresArguments;
    argumentsContainer.appendChild(input);
  }

  form.appendChild(argumentsContainer);
}

function renderOptions(command: Command, elementId: string) {
  const optionsSelect = document.getElementById(elementId) as HTMLSelectElement;
  if (!optionsSelect) return;
  optionsSelect.size = 0;
  optionsSelect.innerHTML = "";
  optionsSelect.onchange = (event) => renderInputs(event, command.options);
  Object.entries(command.options).forEach(([option, { description }]) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionsSelect.size += 1;
    optionElement.textContent = `-${option} ${description}`;
    optionsSelect.appendChild(optionElement);
  });
}

function renderArguments(
  commandData: { commandName: string; command: Command },
  elementId: string
) {
  const argumentsContainer = document.getElementById(
    elementId
  ) as HTMLDivElement;
  if (!argumentsContainer) return;

  const { commandName, command } = commandData;

  argumentsContainer.innerHTML = "";
  if (command.acceptsArguments) {
    const label = document.createElement("label");
    label.innerHTML = `Enter arguments for <code>${commandName}</code>${
      command.requiresArguments ? " (required)" : ""
    }: `;
    argumentsContainer.appendChild(label);
    const input = document.createElement("input");
    input.name = "arguments";
    input.placeholder = "arguments";
    input.required = command.requiresArguments;
    argumentsContainer.appendChild(input);
  }
}

function renderInputs(event: Event, optionsMap: Record<string, Option>) {
  const target = event.target as HTMLSelectElement;
  const options = target.selectedOptions;

  // Convert HTMLCollection to array
  const selectedOptions = Array.from(options).map((option) => option.value);

  // Grab input container and clear it
  const inputsContainer = document.getElementById(
    INPUT_CONTAINER_ID
  ) as HTMLDivElement;

  // Grab the values of the old inputs
  const oldInputs = inputsContainer.querySelectorAll("input");
  const oldValues = new Map<string, string>();
  oldInputs.forEach((input) => {
    oldValues.set(input.name, input.value);
  });

  // Clear the input container
  inputsContainer.innerHTML = "";

  // Create new inputs
  selectedOptions.forEach((option) => {
    if (!optionsMap[option].acceptsArguments) return;
    const label = document.createElement("label");
    label.textContent = `Enter value for -${option}: `;
    inputsContainer.appendChild(label);
    const input = document.createElement("input");
    input.name = option;
    input.placeholder = option;
    input.value = oldValues.get(option) || "";
    inputsContainer.appendChild(input);
  });
}

// **********************************
// * Event Handlers
// **********************************

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  if (!event.target) return;
  const formRef = event.target as HTMLFormElement;
  const formData = new FormData(formRef);
  const command = formData.get("command");
  const options = formData.getAll("options");
  const args = formData.get("arguments");

  if (!command) return;
  const body = {
    command,
    options,
    args: args,
  };

  const result = await fetch("/run", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await result.json();
  console.log({ data });
}

function handleCommandOptionChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const commandName = target.value;
  if (!commandName) return;
  const command =
    COMMAND_OPTIONS_MAP[commandName as keyof typeof COMMAND_OPTIONS_MAP];
  renderOptions(command, OPTIONS_SELECT_ID);
  renderArguments({ commandName, command }, COMMAND_ARGUMENTS_ID);
}
