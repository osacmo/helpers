const fs = require('fs');

fs.readFile('OMX6110056102700108_attlog.dat', 'utf8', (err, data) => {

    const new_data = data.replace(/(\r|\t)/gm, " ").split('\n');

    const creatingObject = new_data.map(el => {
        let auxVec = el.split(' ');

        return {
            "matricula": auxVec.at(1),
            "fecha": auxVec.at(2),
            "hour": auxVec.at(3),
            "code": (auxVec.at(5) == '1') ? "1" : "0"
        }
    })

    let arr_temp = [];
    const final_arr = [];
    const arr_datesSort = [];

    creatingObject.forEach(el => {

        const element = (`${el.matricula},${el.fecha}`).trim();

        let eva_res = arr_temp.find(current => current === element);

        if (typeof eva_res == 'undefined') {

            arr_temp.push(element);

            let aux = creatingObject
                .filter(pos => pos.matricula == el.matricula && el.fecha == pos.fecha)
                .sort((a, b) => a.hour.localeCompare(b.hour));

            final_arr.push(aux);
        }
    });

    final_arr.forEach(el => {
        arr_datesSort.push({
            "matricula": el.at(0).matricula,
            "fecha": el.at(0).fecha,
            "hourIn": el.at(0).hour,
            "hourOut": el.at(-1).hour
        });
    });

    const final_result = arr_datesSort
        .map(el => `"${el.matricula}","${el.fecha}", "${el.hourIn}", "${el.hourOut}"`);

    // console.log(final_result);

    fs.writeFile("lista-matricula.csv", final_result.join('\n'), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
        }
    });
});
