// FORM HELP
var formHelpTriggers = document.querySelectorAll('.form-help-trigger');
formHelpTriggers.forEach(function (el) {
    el.addEventListener('click', function (evt) {
        evt.preventDefault();
        if (this.classList.contains('open')) {
            this.classList.remove('open');
            this.firstElementChild.textContent = 'Need help?';
        } else {
            this.classList.add('open');
            this.firstElementChild.textContent = 'Hide help';
        }
    });
});

// SPINNER INPUTS
var spinnerTriggers = document.querySelectorAll('.spinner-trigger');
spinnerTriggers.forEach(function (el) {
    var targetInput;
    var increment = true;
    if (el.classList.contains('spinner-trigger-less')) {
        targetInput = el.nextElementSibling;
        increment = false;
    } else if (el.classList.contains('spinner-trigger-more')) {
        targetInput = el.previousElementSibling;
    }
    var targetMin = targetInput.min * 1;
    var targetMax = targetInput.max * 1;
    var targetStep = targetInput.step * 1;
    el.addEventListener('click', function (evt) {
        var targetCurrentValue = targetInput.value * 1;
        var newVal;
        if (increment) {
            newVal = targetCurrentValue + targetStep;
            if (newVal <= targetMax) {
                targetInput.value = newVal;
            }
        } else {
            newVal = targetCurrentValue - targetStep;
            if (newVal >= targetMin) {
                targetInput.value = newVal;
            }
        }
    });
    targetInput.addEventListener('click', function () {
        var val = this.value;
        this.value = "";
        this.value = val;
    });
});

// DATE INPUTS
var dates = document.querySelectorAll('.form-date-wrap');
dates.forEach(function (d) {
    var dInputs = d.querySelectorAll('input[type="tel"]'),
        dayInput = dInputs[0],
        monthInput = dInputs[1],
        yearInput = dInputs[2];

    console.log(dInputs);

    dayInput.addEventListener('keyup', function () {
        if (this.value.length > 1) {
            monthInput.focus();
        }
    });
    dayInput.addEventListener('blur', function () {
        if (this.value.length == 1) {
            var val = this.value;
            this.value = '0' + val;
        }
    });
    monthInput.addEventListener('keyup', function () {
        if (this.value.length > 1) {
            yearInput.focus();
        }
    });
    monthInput.addEventListener('blur', function () {
        if (this.value.length == 1) {
            var val = this.value;
            this.value = '0' + val;
        }
    });
    yearInput.addEventListener('blur', function () {
        if (this.value.length == 2) {
            var year = this.value;
            if (year >= 0 && year <= 18) {
                this.value = '20' + year;
            } else {
                this.value = '19' + year;
            }
        }
    });

});

// CONVERSION INPUTS
var lengthWrap = document.querySelectorAll('.form-length-wrap');
lengthWrap.forEach(function (l) {
    var heightInputs = l.querySelectorAll('input'),
        feetInput = heightInputs[0],
        inchInput = heightInputs[1],
        cmInput = heightInputs[2],
        origVal;

    var calcHeight = function () {
        feetInput.value = feetInput.value.split(' ')[0];
        inchInput.value = inchInput.value.split(' ')[0];

        var feet = feetInput.value * 1;
        var inches = inchInput.value * 1;

        if (feet > 8) {
            feet = 8;
            feetInput.value = feet;

        }
        if (inches > 11) {
            inches = 11;
            inchInput.value = inches;
        }

        var totalInches = (feet * 12) + inches;
        var totalCM = Math.round(totalInches * 2.54);
        cmInput.value = totalCM;
    }

    for (var i = 0; i < heightInputs.length; i++) {
        if (i < 2) {
            heightInputs[i].addEventListener('keyup', function () {
                calcHeight();
            });
            heightInputs[i].addEventListener('focus', function () {
                origVal = this.value;
                this.value = "";
            });
        } else {
            heightInputs[i].addEventListener('keyup', function () {
                cmInput.value = cmInput.value.split(' ')[0];

                var totalCM = cmInput.value * 1;
                var totalInches = totalCM / 2.54;
                var feet = Math.floor(totalInches / 12);
                var inches = Math.round(totalInches - (feet * 12));
                feetInput.value = feet;
                inchInput.value = inches;
            });
            heightInputs[i].addEventListener('click', function () {
                origVal = this.value;
                this.value = this.value.split(' ')[0];
            });
        }

        heightInputs[i].addEventListener('blur', function () {
            this.value = this.value == "" ? origVal : this.value;
            calcHeight();
            heightInputs.forEach(function (h) {
                var val = h.value.split(' ')[0];
                val = val == "" ? 0 : val;
                h.value = val + " " + h.getAttribute('placeholder');
            });
        });
    }
});

// DEPENDANT QUESTIONS
var depQuestions = document.querySelectorAll('.dependant-question');
depQuestions.forEach(function (e) {
    var showLink = e.querySelector('.dependant-link a'),
        depWrap = e.querySelector('.dependant-wrap'),
        radios = e.querySelectorAll('input[type=radio]');

    radios.forEach(function (r) {
        r.addEventListener('click', function () {
            e.setAttribute('data-dependant', false);

            switch (depWrap.getAttribute('data-type')) {
                case "dropdown":
                    depWrap.querySelector('select').selectedIndex = 0;
                    break;
                case "text":
                    depWrap.querySelector('input[type=text]').value = "";
                    break;
                case "date":
                    console.log("date")
                    break;
            }

        });
    });

    showLink.addEventListener('click', function () {
        e.setAttribute('data-dependant', true);
        radios.forEach(function (r) {
            r.checked = false;
        });
    });
});

var deps = document.querySelectorAll("[data-depend-parent]");
var depArr = [];
deps.forEach(function (d) {
    var parentId = d.getAttribute('data-depend-parent');

    depArr.push(parentId);
});

var depArr = removeDup(depArr);

depArr.forEach(function (parentId) {
    var par = document.getElementById(parentId);
    var childEl = document.querySelectorAll('[data-depend-parent="' + parentId + '"]');
    var inputs = document.querySelectorAll('input[name="' + par.name + '"]');

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].id == parentId) {
            var depInput = inputs[i];
        }
        if (inputs[i].id !== parentId) {
            var otherInput = inputs[i];
        }
    }

    childEl.forEach(function (wrap) {
        var openBtn = wrap.querySelector('.openBtn'),
            cancelBtn = wrap.querySelector('.dependant__cancel');

        if (openBtn) {
            openBtn.addEventListener('click', function () {
                wrap.setAttribute('data-status', 'open');
                clearValues(wrap.querySelectorAll('.dependant__answers input'));
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                wrap.setAttribute('data-status', 'closed');
                var cards = wrap.querySelectorAll('.card:not(.card__hidden)');
                if (cards.length == 0) {
                    otherInput.checked = true;
                }
            });
        }

        createUndo(wrap.querySelector('.card__default'), depInput);

        if (wrap.querySelector('.dependant__answers .addBtn')) {
            // DEFAULT CARDS **
            var cardCount = 0,
                cardStore = [];

            wrap.querySelector('.dependant__answers .addBtn').addEventListener('click', function () {
                var wrap = this.parentElement,
                    field = wrap.parentElement,
                    questions = wrap.querySelectorAll('.form-field'),
                    cancelLink = field.querySelector('.dependant__cancel'),
                    valid = true;

                // VALIDATION
                var validate = function (question) {
                    valid = true;

                    var validateDate = function () {
                        // DATES
                        var dInputs = question.querySelectorAll('input[type="tel"]'),
                            dField = question.querySelector('.form-date-wrap'),
                            date = dInputs[0].value + '/' + dInputs[1].value + '/' + dInputs[2].value;

                        for (var i = 0; i < dInputs.length; i++) {
                            if (dInputs[i].value == '') {
                                valid = false;
                                dField.classList.remove('error-input');
                                break;
                            } else if (!isValidDate(date)) {
                                dField.classList.add('error-input');
                            } else {
                                dField.classList.remove('error-input');
                            }
                        }

                    }

                    var validateText = function () {
                        question.querySelectorAll('input[type="text"]').forEach(function (textField) {
                            if (textField.value == '') {
                                valid = false;
                            }
                        })
                    }

                    switch (true) {
                        case question.querySelector('.form-date-wrap') !== null:
                            validateDate();
                            break;
                        case question.querySelector('input[type="text"]') !== null:
                            validateText();
                            break;
                    }

                    if (!valid) {
                        question.classList.add('error');
                    } else {
                        question.classList.remove('error');
                    }
                }

                questions.forEach(function (q) {
                    validate(q);
                });

                // PASSED VALIDATION
                if (valid) {
                    var openCard = field.querySelector('.editing');
                    field.setAttribute('data-card', true);
                    var newCard = '';
                    var vals = [];

                    var newEntry = {};
                    wrap.querySelectorAll('input').forEach(function (i) {
                        var val = i.value;
                        if (i.type == 'text' | i.type == 'tel') {
                            val = capitalise(val);
                        }
                        vals.push(val);
                        newEntry[i.id] = val;
                    });

                    if (openCard) {
                        var cardId = openCard.id.split('-')[1];
                        newCard = openCard;
                        var arrKey = cardId - 1;

                        cardStore[arrKey] = newEntry;
                    } else {
                        cardCount = cardCount + 1;
                        newCard = field.querySelector('.card__primative').cloneNode(true);
                        field.querySelector('.card-wrap').appendChild(newCard);
                        newCard.id = 'card-' + cardCount;

                        createUndo(newCard);

                        newCard.querySelector('.edit').addEventListener('click', function () {
                            field.setAttribute('data-status', 'edit');
                            var cards = field.querySelectorAll('.card:not(.card__hidden)');
                            cards.forEach(function (c) {
                                c.classList.remove('editing');
                            })
                            newCard.classList.add('editing');
                            var cardId = (newCard.id.split('-')[1]) - 1;
                            var entry = cardStore[cardId];
                            for (var key in entry) {
                                if (entry.hasOwnProperty(key)) {
                                    document.getElementById(key).value = entry[key];
                                }
                            }
                        });

                        newCard.querySelector('.remove').addEventListener('click', function () {
                            newCard.className = 'card removed';
                            field.setAttribute('data-status', 'closed');
                        });

                        cardStore.push(newEntry);
                    }

                    newCard.className = 'card';
                    newCard.querySelectorAll('.card__name').forEach(function (n) {
                        n.textContent = vals[0] + ' ' + vals[1];
                    });
                    var age = new Date(vals[4], vals[3] - 1, vals[2]);
                    newCard.querySelector('h2').textContent = getAge(age) + ' years old';

                    field.setAttribute('data-status', 'closed');
                }

            });
        }

        // CARD LISTS **
        if (wrap.querySelector('.dependant__answers .dependant__select')) {
            var selects = wrap.querySelectorAll('.dependant__answers .dependant__select select'),
                cardWrap = wrap.querySelector('.card-wrap'),
                catWrap = selects[0].parentElement,
                catSel = selects[0];

            var newList = {};
            var cardEl = [];

            catSel.addEventListener('change', function () {
                selects.forEach(function (s) {
                    var parent = s.parentElement;
                    if (parent.classList.contains(catSel.options[catSel.selectedIndex].value)) {
                        parent.classList.add('show');
                    } else {
                        parent.classList.remove('show');
                    }
                });
            });

            for (var i = 0; i < selects.length; i++) {
                if (i > 0) {
                    selects[i].addEventListener('change', function () {
                        var catVal = catSel.options[catSel.selectedIndex].text;
                        var typeVal = this.options[this.selectedIndex].text;
                        var catIndex = catSel.options[catSel.selectedIndex];
                        var selIndex = this.options[this.selectedIndex];
                        selIndex.disabled = true;

                        if (this.querySelectorAll('option:not(:disabled)').length == 0) {
                            catIndex.disabled = true;
                        } else {
                            catIndex.disabled = false;
                        }

                        var removeDesc = function (card, dd, section) {
                            catIndex.disabled = false;
                            selIndex.disabled = false;
                            var lists = card.querySelectorAll('dd');
                            if (lists.length > 1) {
                                card.querySelector('dl').removeChild(dd);
                            } else {
                                card.parentNode.removeChild(card);
                                var index = Object.keys(newList).indexOf(section);

                                delete newList[catVal];
                                cardEl.splice(index, 1);
                            }
                        }

                        if (newList.hasOwnProperty(catVal)) {
                            var index = Object.keys(newList).indexOf(catVal);

                            newList[catVal].push(typeVal);
                            var newDesc = document.createElement('dd');
                            newDesc.innerHTML = typeVal + '<a class="remove"></a>';

                            cardEl[index].children[0].appendChild(newDesc);

                            newDesc.querySelector('.remove').addEventListener('click', function () {
                                removeDesc(cardEl[index], newDesc, catVal);
                            });

                        } else {
                            newList[catVal] = [typeVal];
                            var newCard = wrap.querySelector('.card__primative').cloneNode(true);
                            newCard.className = 'card';
                            cardWrap.appendChild(newCard);

                            newCard.querySelector('dt').textContent = catVal;
                            newCard.querySelector('dd').innerHTML = typeVal + '<a class="remove"></a>';

                            var dd = newCard.querySelector('dd');

                            newCard.querySelector('.remove').addEventListener('click', function () {
                                removeDesc(newCard, dd, catVal);
                            });

                            cardEl.push(newCard);
                        }

                        wrap.setAttribute('data-card', true);

                        for (var j = 0; j < selects.length; j++) {
                            if (j > 0) {
                                selects[j].selectedIndex = 0;
                            }
                        }
                    });
                }
            }

        }

    })

    // DEPENDANT SWITCHES
    switch (par.nodeName) {
        case 'INPUT':
            inputs.forEach(function (input) {
                input.addEventListener('click', function () {
                    if (this.id == parentId) {
                        childEl.forEach(function (c) {
                            c.setAttribute('data-status', 'open');
                            clearValues(c.querySelectorAll('.dependant__answers input'));
                            var cards = c.querySelectorAll('.card:not(.card__hidden)');
                            if (cards.length > 0 && c.classList.contains('card-list')) {
                                c.setAttribute('data-status', 'open');
                            }
                            else if (cards.length > 0) {
                                c.setAttribute('data-status', 'closed');
                            }
                        });
                    } else {
                        childEl.forEach(function (c) {
                            c.setAttribute('data-status', 'closed');
                            var cards = c.querySelectorAll('.card:not(.card__hidden)');
                            if (cards.length > 0) {
                                c.setAttribute('data-status', 'removed');
                            }
                        });
                    }
                })
            });
            break;
    }
});


// UNDO CARD REMOVALS
function createUndo(undoWrap, depInput) {
    var undoEl = undoWrap.querySelector('.card__removal'),
        undoBtn = undoWrap.querySelector('.card__removal button'),
        undoParent = getParent(undoWrap, 'dependant'),
        defaultCard = undoWrap.classList.contains('card__default') ? true : false;

    var touching = false,
        startPos,
        currentTouch,
        move,
        removing;

    undoBtn.addEventListener('touchstart', function (evt) {
        touching = true
        startPos = event.touches[0].clientX;
    }, false);

    undoBtn.addEventListener('touchmove', function (evt) {
        if (touching) {
            undoWrap.classList.remove('snap');
            currentTouch = event.touches[0].clientX;
            move = startPos - currentTouch;
            undoEl.style.left = '-' + move + 'px';
        }
    }, false);


    undoBtn.addEventListener('touchend', function (evt) {
        touching = false;

        // CHECK IF USER HAS PASSED HALF THE VIEWPORT WIDTH
        if ((document.documentElement.clientWidth / 2) < currentTouch) {
            undoEl.removeAttribute("style");
            undoWrap.classList.add('snap');
        } else {
            undoEl.removeAttribute("style");
            undoWrap.classList.add('done');
            removing = setTimeout(function () {
                if (defaultCard && undoParent.classList.contains('card-list')) {
                    undoParent.setAttribute('data-status', 'open');
                    depInput.checked = true;
                } else if (defaultCard) {
                    undoParent.setAttribute('data-status', 'closed');
                    depInput.checked = true;
                }
                undoWrap.classList.remove('removed', 'snap', 'done');
            }, 400);
        }
    }, false);

    undoBtn.addEventListener('click', function (evt) {
        undoWrap.classList.remove('snap');
        undoWrap.classList.add('done');
        clearTimeout(removing)
        removing = setTimeout(function () {
            if (defaultCard && undoParent.classList.contains('card-list')) {
                undoParent.setAttribute('data-status', 'open');
                depInput.checked = true;
            } else if (defaultCard) {
                undoParent.setAttribute('data-status', 'closed');
                depInput.checked = true;
            }
            undoWrap.classList.remove('removed', 'snap', 'done');
        }, 400);
    }, false);
}



// SUPER HELPFUL FUNCTIONS: LET ME TAKE YOU TO FUNC-Y TOWN
function removeDup(arr) { // REMOVES DUPS IN ARRAY
    var unique = arr.filter(function (elem, index, self) {
        return index == self.indexOf(elem);
    });
    return unique;
};

function getParent(el, cls) { //TRAVERSES DOM TO GET PARENT FROM ORIG EL AND CLASS
    while (el.parentNode) {
        el = el.parentNode;
        if (el.classList.contains(cls))
            return el;
    }
    return null;
}

function getAge(birthday) { // GETS AGE IN mmddyyyy FORMAT
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function isValidDate(dateString) { // CHECKS DATE VALIDATION
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    if (year < 1900 || year > 2017 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    return day > 0 && day <= monthLength[month - 1];
};

function clearValues(inputs) { // CLEARS INPUTS
    inputs.forEach(function (i) {
        switch (i.type) {
            case 'radio':
            case 'checkbox':
                i.checked = false;
                break;
            case 'text':
            case 'tel':
            case 'email':
            case 'password':
                i.value = '';
                break;
        }
    });
}

function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
