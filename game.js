var ROW = 6;
var COL = 7;

function createTable() {
    const body = document.body
    const table = document.createElement('table');
    body.append(table);
    for (let i = 0; i < ROW; i++) {
        const tr = document.createElement('tr');
        table.append(tr);
        for (let j = 0; j < COL; j++) {
            const td = document.createElement('td');
            tr.append(td);
            td.className = "cell";
            td.id = `cell${i}${j}`
        }
    }
}


createTable();