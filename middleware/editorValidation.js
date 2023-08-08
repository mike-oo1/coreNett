const validator = require('validator')


const validateEmail = (Email, FirstName, Surname) => {
    if (!validator.isEmail(Email)) {
        return {
            isValid: false,
            message: 'Invalid Email Format'
        };
    }

    const stringPattern = /^[A-Za-z]+$/;

    if (!stringPattern.test(FirstName)) {
        return {
            isValid: false,
            message: 'Invalid Name Format. Only letters and spaces are allowed.'
        };
    }
    const string = /^[A-Za-z]+$/;

    if (!string.test(Surname,)) {
        return {
            isValid: false,
            message: 'Invalid Name Format. Only letters and spaces are allowed.'
        };
    }

    return {
        isValid: true
    };
};



module.exports = validateEmail