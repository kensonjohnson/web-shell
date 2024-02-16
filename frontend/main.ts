// **********************************
// * Define Constants
// **********************************

const OPTIONS_SELECT_ID = "options-select";

const COMMAND_OPTIONS_MAP = {
  ls: {
    l: "Detailed list",
    a: "Show hidden files",
    p: "Add / to end of directories",
    G: "Colorize output",
  },
  cat: {
    n: "Add number lines",
    s: "Remove extra spaces",
  },
};

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
createOptionsSelectElement(COMMAND_OPTIONS_MAP.ls, form);

const submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Run";
form.appendChild(submitButton);

// Attach form to body and render default options
document.body.appendChild(form);

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
  options: Record<string, string>,
  form: HTMLFormElement
) {
  const optionsSelect = document.createElement("select");
  optionsSelect.name = "option";
  optionsSelect.id = OPTIONS_SELECT_ID;
  optionsSelect.multiple = true;
  optionsSelect.size = 0;

  Object.entries(options).forEach(([option, description]) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionsSelect.size += 1;
    optionElement.textContent = `-${option} ${description}`;
    optionsSelect.appendChild(optionElement);
  });

  form.appendChild(optionsSelect);
}

function renderOptions(options: Record<string, string>, elementId: string) {
  const optionsSelect = document.getElementById(elementId) as HTMLSelectElement;
  if (!optionsSelect) return;
  optionsSelect.size = 0;
  optionsSelect.innerHTML = "";
  Object.entries(options).forEach(([option, description]) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionsSelect.size += 1;
    optionElement.textContent = `-${option} ${description}`;
    optionsSelect.appendChild(optionElement);
  });
}

// **********************************
// * Event Handlers
// **********************************

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  if (!event.target) return;
  const formRef = event.target as HTMLFormElement;
  const formData = new FormData(formRef);
  const command = formData.get("command");
  const options = formData.getAll("option");
  if (!command) return;
  // fetch(`http://localhost:3000/run?command=${command}`);
  console.log({ command, options });
}

function handleCommandOptionChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const command = target.value;
  if (!command) return;
  const options =
    COMMAND_OPTIONS_MAP[command as keyof typeof COMMAND_OPTIONS_MAP];
  renderOptions(options, OPTIONS_SELECT_ID);
}
