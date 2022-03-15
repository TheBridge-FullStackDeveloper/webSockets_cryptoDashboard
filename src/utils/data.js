export default (input) => {
    return input.map(e=>{

        let date = new Date(e[0] * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let formattedDate = `${day}-${month}-${year}`;
        
        return {x:formattedDate, y:e[4]}
    });
};