window.addEventListener("load", function () {

    const year = new Date();

    function cc_brand_id(cur_val) {
        // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
        // regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also

        //JCB
        jcb_regex = new RegExp('^(?:2131|1800|35)[0-9]{0,}$'); //2131, 1800, 35 (3528-3589)
        // American Express
        amex_regex = new RegExp('^3[47][0-9]{0,}$'); //34, 37
        // Diners Club
        diners_regex = new RegExp('^3(?:0[0-59]{1}|[689])[0-9]{0,}$'); //300-305, 309, 36, 38-39
        // Visa
        visa_regex = new RegExp('^4[0-9]{0,}$'); //4
        // MasterCard
        mastercard_regex = new RegExp('^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'); //2221-2720, 51-55
        maestro_regex = new RegExp('^(5[06789]|6)[0-9]{0,}$'); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
        //Discover
        discover_regex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$');
        ////6011, 622126-622925, 644-649, 65


        // get rid of anything but numbers
        cur_val = cur_val.replace(/\D/g, '');

        // checks per each, as their could be multiple hits
        //fix: ordering matter in detection, otherwise can give false results in rare cases
        var sel_brand = "unknown";

        if (cur_val.match(jcb_regex)) {
            sel_brand = "jcb";
        } else if (cur_val.match(amex_regex)) {
            sel_brand = "amex";
        } else if (cur_val.match(diners_regex)) {
            sel_brand = "diners_club";
        } else if (cur_val.match(visa_regex)) {
            sel_brand = "visa";
        } else if (cur_val.match(mastercard_regex)) {
            sel_brand = "mastercard";
        } else if (cur_val.match(discover_regex)) {
            sel_brand = "discover";
        } else if (cur_val.match(maestro_regex)) {
            if (cur_val[0] == '5') { //started 5 must be mastercard
                sel_brand = "mastercard";
            } else {
                sel_brand = "maestro"; //maestro is all 60-69 which is not something else, thats why this condition in the end
            }
        }

        return sel_brand;
    }

    const cc_name_show = document.getElementById("cc_name");
    const cc_numbers_show = document.getElementById("cc_numbers");
    const cc_month_show = document.getElementById("cc_month");
    const cc_year_show = document.getElementById("cc_year");
    const cc_cvv_show = document.getElementById("cc_cvv");

    const cc_name_form = document.querySelector("[name='cc_name']");
    const cc_numbers_form = document.querySelector("[name='cc_numbers']");
    const cc_month_form = document.querySelector("[name='cc_month']");
    const cc_year_form = document.querySelector("[name='cc_year']");
    const cc_cvv_form = document.querySelector("[name='cc_cvv']");
    const cc_form = document.getElementById("cc_form");

    const c_card = document.querySelector(".c_card");

    const currentMonth = year.toLocaleDateString('en', { month: '2-digit' });
    const currentYear = year.toLocaleDateString('en', { year: '2-digit' });

    cc_month_show.innerText = currentMonth;

    cc_year_show.innerText = currentYear;

    cc_name_form.addEventListener("input", function () {

        if (cc_name_form.value.length < 1) {
            cc_name_show.innerText = "Mr. John Doe";
        } else {
            cc_name_show.innerText = cc_name_form.value;
        }
    });

    cc_numbers_form.addEventListener("input", function () {

        const cc_numbers_value = cc_numbers_form.value;

        const mastercardRegex = cc_numbers_value.substr(0, 4).replace(/[0-9]/g, '*') + " " + cc_numbers_value.substr(4, 4).replace(/[0-9]/g, '*') + " " + cc_numbers_value.substr(8, 4).replace(/[0-9]/g, '*') + " " + cc_numbers_value.substr(12, 4);

        const amexRegex = cc_numbers_value.substr(0, 4).replace(/[0-9]/g, '*') + " " + cc_numbers_value.substr(4, 6).replace(/[0-9]/g, '*') + " " + cc_numbers_value.substr(10, 5);

        if (cc_numbers_form.value.length < 1) {

            cc_numbers_show.innerText = "**** **** **** 3221";

        } else {

            if (cc_brand_id(cc_numbers_form.value) === "amex") {

                cc_numbers_form.setAttribute("maxlength", "15");
                cc_numbers_show.innerText = amexRegex;

            } else if (cc_brand_id(cc_numbers_form.value) === "visa" || cc_brand_id(cc_numbers_form.value) === "mastercard") {

                cc_numbers_form.setAttribute("maxlength", "16");
                cc_numbers_show.innerText = mastercardRegex;

            }

        }


        if (cc_brand_id(cc_numbers_form.value) === "unknown") {
            if (document.querySelector(".cc_brand")) {
                document.querySelector(".cc_brand").remove();
            }
        } else {
            if (!document.querySelector(".cc_brand")) {
                const img = document.createElement("img");
                img.classList.add("cc_brand");
                img.setAttribute("alt", cc_brand_id(cc_numbers_form.value) + " card");
                document.querySelector(".c_card_front").append(img);
                document.querySelector(".cc_brand").src = "assets/svgs/" + cc_brand_id(cc_numbers_form.value) + ".svg";

            }
        }

    });

    cc_month_form.addEventListener("change", function () {

        if (cc_month_form.value.length < 1) {

            cc_month_show.innerText = currentMonth;

        } else {

            cc_month_show.innerText = cc_month_form.value;

        }

        console.log(cc_month_form.value);

    });

    cc_year_form.addEventListener("change", function () {

        if (cc_year_form.value.length < 1) {

            cc_year_show.innerText = currentYear;

        } else {

            cc_year_show.innerText = cc_year_form.value;

        }

    });

    cc_cvv_form.addEventListener("input", function () {

        c_card.classList.add("back_visible");

        if (cc_cvv_form.value.length < 1) {

            cc_cvv_show.innerText = "***";

        } else {

            cc_cvv_show.innerText = cc_cvv_form.value.substr(0, 3).replace(/[0-9]/g, '*');

        }

    });

    cc_cvv_form.addEventListener("blur", function () {
        if (c_card.classList.contains("back_visible")) {
            c_card.classList.remove("back_visible");
        }
    })

    cc_form.addEventListener("submit", function (e) {
        e.preventDefault();

        const requestData = `cc_name=${cc_name_form.value}&cc_numbers=${cc_numbers_form.value}&cc_month=${cc_month_form.value}&cc_year=${cc_year_form.value}&cc_cvv=${cc_cvv_form.value}`;

        console.log(requestData);
    });

});