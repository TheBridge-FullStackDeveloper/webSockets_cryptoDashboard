const processData = (input) => {
    input.reverse()
    return input.map(e=>{

        let date = new Date(e[0] * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let formattedDate = `${day}-${month}-${year}`;
        
        return {x:formattedDate, y:e[4]}
    });
};
    // setea 1/10 de las fechas para una mejor presentación
    const thicker = (array) => {
    let input = array[0]?.data;
    let output = [];
    input.map(({x},i) => { if (i%10==0) { output.push(x) };} );

    return output
}

export {
    processData,
    thicker
}