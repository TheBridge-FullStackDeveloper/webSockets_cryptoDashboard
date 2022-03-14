processData = (input) => {
    console.log(input);
    input.map(({timestamp,price_close}))
    return input
};

module.exports= processData;