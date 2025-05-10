import styles from './style.module.css'

export function submitErrorHandle(inputs) {
    inputs.forEach(input => {
        if (input.classList.contains(styles.successfull)) {
            input.classList.remove(styles.successfull)
        }

        input.classList.add(styles.error);
        const infoText = input.nextElementSibling;

        if (infoText.classList.contains(styles.successText)) {
            infoText.classList.remove(styles.successText)
        }

        infoText.classList.add(styles.errorText);
        infoText.classList.add(styles.active);

        infoText.innerText = `Wrong ${input.name}`

        input.addEventListener('input', () => {
            input.classList.remove(styles.error);

            if (infoText.classList.contains(styles.active)) {
                infoText.classList.remove(styles.active);
            }
        })
    });
}

export function submitSuccessHandle(inputs) {
    inputs.forEach(input => {
        if (input.classList.contains(styles.error)) {
            input.classList.remove(styles.error);
        }

        const infoText = input.nextElementSibling;

        if (infoText.classList.contains(styles.errorText)) {
            infoText.classList.remove(styles.errorText)
        }

        infoText.classList.add(styles.successText);
        infoText.classList.add(styles.active);

        infoText.innerText = `Successfull`

        input.classList.add(styles.successfull);
    })
}