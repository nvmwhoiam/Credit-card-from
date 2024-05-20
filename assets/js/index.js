// Function to identify credit card brand based on number
function creditCardValidator(creditCardValue) {
    // Define regular expressions for each card brand
    const regexes = {
        // JCB
        jcb: /^(?:2131|1800|35)[0-9]{0,}$/,
        // American Express
        amex: /^3[47][0-9]{0,}$/,
        // Diners Club
        diners: /^3(?:0[0-59]{1}|[689])[0-9]{0,}$/,
        // Visa
        visa: /^4[0-9]{0,}$/,
        // MasterCard
        mastercard: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/,
        // Maestro
        maestro: /^(5[06789]|6)[0-9]{0,}$/,
        // Discover
        discover: /^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$/,
    };

    // Remove non-digit characters from input
    creditCardValue = creditCardValue.replace(/\D/g, '');

    // Iterate through regexes to identify the brand
    for (const brand in regexes) {
        if (creditCardValue.match(regexes[brand])) {
            return brand;
        }
    }

    return "unknown";
}

const formElements = {
    cardHolder: document.getElementById("cardHolderInput"),
    cardNumber: document.getElementById("cardNumberInput"),
    expiryMonth: document.getElementById("expiryMonthInput"),
    expiryYear: document.getElementById("expiryYearInput"),
    cvv: document.getElementById("cvvInput"),
    form: document.getElementById("creditCardForm"),
};

const cardInfoElements = {
    cardHolderName: document.getElementById("cardHolderName"),
    cardNumber: document.getElementById("cardNumber"),
    expiryMonth: document.getElementById("expiryMonth"),
    expiryYear: document.getElementById("expiryYear"),
    cvv: document.getElementById("cvv"),
};

const creditCard = document.querySelector(".credit_card");

// Get the current currentDate
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
const numberOfYears = 10;

for (let i = 0; i < numberOfYears; i++) {
    const currentDate = currentYear + i;
    const option = document.createElement("option");
    option.value = currentDate.toString().slice(-2);
    option.text = currentDate.toString().slice(-2);

    if (i === 0) {
        option.setAttribute('selected', 'selected');
    }

    formElements.expiryYear.appendChild(option);
}

cardInfoElements.expiryMonth.innerText = currentMonth.toString().padStart(2, "0");
cardInfoElements.expiryYear.innerText = currentYear.toString().slice(-2);

function updateMonthOptions() {
    const currentInputYear = formElements.expiryYear.value;

    formElements.expiryMonth.innerHTML = "";

    if (currentInputYear === currentYear.toString().slice(-2)) {
        for (let i = currentMonth; i <= 12; i++) {
            const option = document.createElement("option");
            option.value = i.toString().padStart(2, "0"); // Ensuring two-digit format
            option.text = i.toString().padStart(2, "0");

            if (currentMonth === i) {
                option.setAttribute('selected', 'selected');
            }

            formElements.expiryMonth.appendChild(option);
        }
    } else if (currentInputYear > currentYear.toString().slice(-2)) {

        for (let i = 1; i <= 12; i++) {
            const option = document.createElement("option");
            option.value = i.toString().padStart(2, "0"); // Ensuring two-digit format
            option.text = i.toString().padStart(2, "0");

            if (currentMonth === i) {
                option.setAttribute('selected', 'selected');
            }

            formElements.expiryMonth.appendChild(option);
        }
    }
}

updateMonthOptions();

formElements.cardHolder.addEventListener("input", function () {
    cardInfoElements.cardHolderName.innerText = formElements.cardHolder.value || formElements.cardHolder.getAttribute("placeholder");
});

let currentBrand = '';

formElements.cardNumber.addEventListener("input", function () {
    const cardNumberValue = formElements.cardNumber.value;
    const brand = creditCardValidator(cardNumberValue);

    let maskedNumbers = '';

    if (cardNumberValue.length < 1) {
        maskedNumbers = formElements.cardNumber.getAttribute("placeholder");
    } else {
        if (brand === "amex") {
            maskedNumbers = `${cardNumberValue.substr(0, 4).replace(/[0-9]/g, '*')} ${cardNumberValue.substr(4, 6).replace(/[0-9]/g, '*')} ${cardNumberValue.substr(10, 5)}`;
            formElements.cardNumber.setAttribute("maxlength", "15");
        } else {
            maskedNumbers = `${cardNumberValue.substr(0, 4).replace(/[0-9]/g, '*')} ${cardNumberValue.substr(4, 4).replace(/[0-9]/g, '*')} ${cardNumberValue.substr(8, 4).replace(/[0-9]/g, '*')} ${cardNumberValue.substr(12, 4)}`;
            formElements.cardNumber.setAttribute("maxlength", "16");
        }
    }

    cardInfoElements.cardNumber.innerText = maskedNumbers;

    if (currentBrand !== brand) {
        document.querySelector(".card_brand_logo").src = `assets/svgs/${brand}.svg`;
        currentBrand = brand;  // Update the current brand
    }
});



// Store the original card number and card svv when the input is focused 
let originalCardNumber = "";
let isOriginalCardNumberFilled = false;
let originalCvv = "";
let isOriginalCvvFilled = false;

formElements.cardNumber.addEventListener("blur", function () {
    let cardNumberValue = formElements.cardNumber.value;
    const cardNumberLength = formElements.cardNumber.getAttribute("maxlength");

    if (cardNumberValue.length == cardNumberLength) {
        originalCardNumber = cardNumberValue;

        // Mask the card number
        formElements.cardNumber.value = maskCardNumber(cardNumberValue, cardNumberLength);

        isOriginalCardNumberFilled = true;
    }
});

formElements.cardNumber.addEventListener("focus", function () {

    if (isOriginalCardNumberFilled) {
        // Restore the card number
        formElements.cardNumber.value = originalCardNumber;
    }

    isOriginalCardNumberFilled = false;
});

function maskCardNumber(cardNumber, cardNumberLength) {
    // Remove any existing spaces and non-numeric characters
    cardNumber = cardNumber.replace(/\s+/g, '').replace(/\D/g, '');

    // Determine the number of digits to mask based on cardNumberLength
    let digitsToMask = (cardNumberLength == 16) ? 4 : 5;

    // Mask all digits except the last specified digits
    let maskedDigits = "*".repeat(cardNumber.length - digitsToMask) + cardNumber.slice(-digitsToMask);

    // Insert spaces for formatting
    if (cardNumberLength == 16) {
        // For 16-digit card numbers, insert a space after every four digits
        maskedDigits = maskedDigits.replace(/(.{4})(.{4})(.{4})/, '$1 $2 $3 ');
    } else if (cardNumberLength == 15) {
        // For 15-digit card numbers, insert a space after the first 4 digits
        maskedDigits = maskedDigits.replace(/(.{4})(.{6})(.{5})/, '$1  $2  $3');
    }

    return maskedDigits.trim(); // Trim any trailing spaces and return
}

formElements.cvv.addEventListener("blur", function () {
    let cvvValue = formElements.cvv.value;

    if (cvvValue.length == 3) {
        originalCvv = cvvValue;

        // Mask the CVV
        formElements.cvv.value = maskCVV(cvvValue);

        isOriginalCvvFilled = true;
    }
});

formElements.cvv.addEventListener("focus", function () {

    if (isOriginalCvvFilled) {
        // Restore the original CVV
        formElements.cvv.value = originalCvv;
    }

    isOriginalCvvFilled = false;
});

function maskCVV(cvv) {
    // Mask all digits
    return "*".repeat(cvv.length);
}

formElements.expiryMonth.addEventListener("change", function () {
    cardInfoElements.expiryMonth.innerText = formElements.expiryMonth.value;
});

formElements.expiryYear.addEventListener("change", function () {
    cardInfoElements.expiryYear.innerText = formElements.expiryYear.value;

    updateMonthOptions();
});

formElements.cvv.addEventListener("input", function () {

    if (!creditCard.classList.contains("back_visible")) {
        creditCard.classList.add("back_visible");
    }

    cardInfoElements.cvv.innerText = formElements.cvv.value.replace(/\d/g, "*") || "***";
});

formElements.cvv.addEventListener("blur", function () {
    creditCard.classList.remove("back_visible");
});

formElements.form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (isOriginalCardNumberFilled && isOriginalCvvFilled) {
        const formData = {
            cardHolder: formElements.cardHolder.value,
            cardNumber: originalCardNumber,
            expiryMonth: formElements.expiryMonth.value,
            expiryYear: formElements.expiryYear.value,
            cvv: originalCvv,
        };
        console.log(formData);
    }

});