const processData = (input) => {
    console.log(input);
    return input.map(e=>{

        let date = new Date(e[0] * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let formattedDate = `${day}-${month}-${year}`;
        
        return {x:formattedDate, y:e[4]}
    });
};

const thicker = (array) => {
    // console.log(array[0]?.data)
    let input = array[0]?.data;
    let output = [];
    input.map(({x},i) => { if (i%5==0) { output.push(x) };} );
    // console.log(output)
    return output
}




export {
    processData,
    thicker
}