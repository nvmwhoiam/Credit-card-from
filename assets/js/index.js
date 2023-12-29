// Get the current year
const year = new Date();

// Function to identify credit card brand based on number
function cc_brand_id(cur_val) {
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
    cur_val = cur_val.replace(/\D/g, '');

    // Iterate through regexes to identify the brand
    for (const brand in regexes) {
        if (cur_val.match(regexes[brand])) {
            return brand;
        }
    }

    return "unknown";
}

// Get DOM elements
const cardInfoElements = {
    name: document.getElementById("ccNameCard"),
    number: document.getElementById("ccNumberCard"),
    month: document.getElementById("ccMonthCard"),
    year: document.getElementById("ccYearCard"),
    cvv: document.getElementById("ccCvvCard"),
};

const formElements = {
    name: document.querySelector("[name='cc_name']"),
    numbers: document.querySelector("[name='cc_numbers']"),
    month: document.querySelector("[name='cc_month']"),
    year: document.querySelector("[name='cc_year']"),
    cvv: document.querySelector("[name='cc_cvv']"),
    form: document.getElementById("cc_form"),
};

const cCard = document.querySelector(".c_card");

// Get current month and year
const currentMonth = year.toLocaleDateString('en', { month: '2-digit' });
const currentYear = year.toLocaleDateString('en', { year: '2-digit' });

// Initialize month and year displays
cardInfoElements.month.innerText = currentMonth;
cardInfoElements.year.innerText = currentYear;

// Update card name based on input
formElements.name.addEventListener("input", function () {
    cardInfoElements.name.innerText = formElements.name.value.length < 1 ? "Mr. John Doe" : formElements.name.value;
});

// Update card numbers, masking digits as needed
formElements.numbers.addEventListener("input", function () {
    const ccNumbersValue = formElements.numbers.value;
    const brand = cc_brand_id(ccNumbersValue);

    if (ccNumbersValue.length < 1) {
        cardInfoElements.number.innerText = "**** **** **** 3221";
    } else {
        let maskedNumbers = '';
        if (brand === "amex") {
            maskedNumbers = `${ccNumbersValue.substr(0, 4).replace(/[0-9]/g, '*')} ${ccNumbersValue.substr(4, 6).replace(/[0-9]/g, '*')} ${ccNumbersValue.substr(10, 5)}`;
            formElements.numbers.setAttribute("maxlength", "15");
        } else if (brand === "visa" || brand === "mastercard") {
            maskedNumbers = `${ccNumbersValue.substr(0, 4).replace(/[0-9]/g, '*')} ${ccNumbersValue.substr(4, 4).replace(/[0-9]/g, '*')} ${ccNumbersValue.substr(8, 4).replace(/[0-9]/g, '*')} ${ccNumbersValue.substr(12, 4)}`;
            formElements.numbers.setAttribute("maxlength", "16");
        }
        cardInfoElements.number.innerText = maskedNumbers;
    }

    const ccBrandImage = document.querySelector(".ccBrand");
    if (brand === "unknown") {
        if (ccBrandImage) {
            ccBrandImage.remove();
        }
    } else {
        if (!ccBrandImage) {
            const img = document.createElement("img");
            img.classList.add("ccBrand");
            img.setAttribute("alt", `${brand} card`);
            document.querySelector(".c_card_front").append(img);
            img.src = `assets/svgs/${brand}.svg`;
        }
    }
});

// Update card expiration month
formElements.month.addEventListener("change", function () {
    cardInfoElements.month.innerText = formElements.month.value.length < 1 ? currentMonth : formElements.month.value;
});

// Update card expiration year
formElements.year.addEventListener("change", function () {
    cardInfoElements.year.innerText = formElements.year.value.length < 1 ? currentYear : formElements.year.value;
});

// Update card CVV, masking digits as needed
formElements.cvv.addEventListener("input", function () {
    cCard.classList.add("back_visible");
    cardInfoElements.cvv.innerText = formElements.cvv.value.length < 1 ? "***" : formElements.cvv.value.substr(0, 3).replace(/[0-9]/g, '*');
});

// Hide CVV input when blurred
formElements.cvv.addEventListener("blur", function () {
    if (cCard.classList.contains("back_visible")) {
        cCard.classList.remove("back_visible");
    }
});

// Form submission handler
formElements.form.addEventListener("submit", function (e) {
    e.preventDefault();

    const jsonData = {
        cName: formElements.name.value,
        cNumbers: formElements.numbers.value,
        cMonth: formElements.month.value,
        cYear: formElements.year.value,
        cCvv: formElements.cvv.value,
    };

    console.log(jsonData);
});
