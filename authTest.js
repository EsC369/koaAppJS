module.exports = function (ctx) {
    const password_hashed = "$2b$10$XdRov6qQqPHIAtnHroKzge4dEAEQ6tk1cH3zUozm4YHpjFYkezKyC";
    const body = ctx.request.body;
    const username = body.username;
    const password = body.password;
    bcrypt.compare(password, hashed_password)
    .then(result => {
        console.log("True or False: Was your password correct?");
        console.log(result);

    })
    .catch(error => {
        console.log(error);
    })
    return result
};