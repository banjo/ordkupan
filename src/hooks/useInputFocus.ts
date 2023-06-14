let isFocusDisabled = false;
let inputRef: HTMLInputElement | null = null;

function setIsFocusDisabled(value: boolean) {
    isFocusDisabled = value;
}

function setInputRef(ref: HTMLInputElement) {
    inputRef = ref;
}

const focus = () => {
    if (isFocusDisabled) {
        return;
    }
    setTimeout(() => {
        inputRef?.focus();
    }, 0);
};

export const useInputFocus = () => {
    return { focus, isFocusDisabled, setInputRef, setIsFocusDisabled };
};
