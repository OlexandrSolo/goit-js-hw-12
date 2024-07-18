const hiddenClass = "is-hidden";

function hide(button) {
    button.classList.add(hiddenClass);
}

function show(button) {
    button.classList.remove(hiddenClass);
}

function disabled(button) {
    button.disabled = true;
    // spinner.classList.remove(hiddenClass);
}

function enable(button) {
    button.disabled = false;
    // spinner.classList.add(hiddenClass);
}

export default { hide, show, disabled, enable }