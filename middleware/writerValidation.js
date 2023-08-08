const validator = require('validator')


const validateEmail = (Email, FullName) => {
    if (!validator.isEmail(Email)) {
        return {
            isValid: false,
            message: 'Invalid Email Format'
        };
    }

    const stringPattern = /^[A-Za-z ]+$/;

    if (!stringPattern.test(FullName)) {
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