const Textarea = {
    elements: {
        main: null,
        text: null
    },
    init() {
        this.elements.main = document.createElement("div");
        this.elements.text = document.createElement("textarea");

        this.elements.text.classList.add("textarea", "use-keyboard-input");

        this.elements.main.appendChild(this.elements.text);
        document.body.appendChild(this.elements.main);
    }
};

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        language: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard-hidden");
        this.elements.keysContainer.classList.add("keyboard_keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard_key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            [["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace", 
            "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
            "lang", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "done",
            "space"], 
            ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "backspace", 
            "tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|",
            "caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", '"', "enter",
            "lang", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", "done",
            "space"]],
            [["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace", 
            "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "|",
            "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", 'э', "enter",
            "lang", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "done",
            "space"],
            ["Ё", "!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "backspace", 
            "tab", "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ", "/",
            "caps", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", 'Э', "enter",
            "lang", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ",", "done",
            "space"]]
        ];
        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        let x = this.properties.language ? 1 : 0;
        let y = this.properties.capsLock ? 1 : 0;

        keyLayout[x][y].forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "\\", "enter", "done"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard_key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard_key-wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard_key-wide", this.properties.capsLock ? "keyboard_key-active" : "keyboard_key-activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard_key-wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "tab":
                    keyElement.classList.add("keyboard_key-wide");
                    keyElement.innerHTML = createIconHTML("keyboard_tab");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "    ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard_key-extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard_key-wide", "keyboard_key-dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "lang":
                    keyElement.classList.add("keyboard_key-wide", this.properties.language ? "keyboard_key-ru" : "keyboard_key-en");
                    keyElement.innerHTML = createIconHTML("language");

                    keyElement.addEventListener("click", () => {
                        this._toggleLanguage();
                    });

                    break;

                default:
                    keyElement.textContent = key;

                    keyElement.addEventListener("click", () => {
                        this.properties.value += key;
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleLanguage() {
        this.properties.language = !this.properties.language;
        this.init();
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        this.init();
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard-hidden");
    },

    //close() {
    //    this.properties.value = "";
    //    this.eventHandlers.oninput = oninput;
    //    this.eventHandlers.onclose = onclose;
    //    this.elements.main.classList.add("keyboard-hidden");
    //}
};

window.addEventListener("DOMContentLoaded", function () {
    Textarea.init();
    Keyboard.init();
});