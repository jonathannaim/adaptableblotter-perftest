import { Row } from "./row";

export class DataGenerator {

    private columnType = ["string", "int", "number"]

    getData(rowNumber: number, columnNumber: number): any[] {
        var data = [];
        let columnsType = []
        for (let i = 0; i < columnNumber; i++) {
            if (i % 3 == 1) {
                columnsType.push("string")
            }
            else if (i % 3 == 2) {
                columnsType.push("int")
            }
            else if (i % 3 == 0) {
                columnsType.push("number")
            }
        }
        for (var i = 0; i < rowNumber; i++) {
            var trade = this.createRow(i, columnsType);
            data.push(trade);
        }
        return data;
    }

    startTickingData(grid: any, interval: number) {
        setInterval(() => {
            for (let record of grid.behavior.getData()) {
                let numberToAdd: number = this.generateRandomInt(1, 2) == 1 ? -0.5 : 0.5;
                record["NumberColumn0"] = this.roundTo4Dp(record["NumberColumn0"] + numberToAdd);
                record["NumberColumn3"] = this.roundTo4Dp(record["NumberColumn3"] + numberToAdd);

            }
        }, interval)
    }

    createRow(i: number, columnsType: string[]): Row {
        var row: Row = { primaryKey: i }
        columnsType.forEach((x, index) => {

            switch (x) {
                case "string": {
                    let columnId = "StringColumn" + index
                    if (index === 1) {
                        row[columnId] = this.getRandomItem(this.names)
                    }
                    else {
                        row[columnId] = Math.random().toString(36).slice(2)
                    }
                    break
                }
                case "int": {
                    let columnId = "IntColumn" + index
                    row[columnId] = this.generateRandomInt(0, 999)
                    break
                }
                case "number": {
                    let columnId = "NumberColumn" + index
                    row[columnId] = this.getMeaningfulPositiveNegativeDouble()
                    break
                }
            }
        })
        return row;
    }

    // If minValue is 1 and maxValue is 2, then Math.random()*(maxValue-minValue+1)
    // generates a value between 0 and 2 =[0, 2), adding 1 makes this
    // [1, 3) and Math.floor gives 1 or 2.
    public generateRandomInt(minValue: number, maxValue: number): number {
        return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
    }

    // [0, 1)
    protected generateRandomDouble(): number {
        return Math.random();
    }

    protected getMeaningfulPositiveNegativeDouble(): number {
        return this.roundTo4Dp(this.generateRandomInt(-150, 150) + this.generateRandomDouble());
    }

    protected roundTo4Dp(val: number): number {
        return Math.round(val * 10000) / 10000;
    }

    public getRandomItem(ary: any[], max?: number): any {
        if (max) {
            return ary[this.generateRandomInt(0, Math.min(max, ary.length - 1))];
        }
        else {
            return ary[this.generateRandomInt(0, ary.length - 1)];
        }
    }
    private names: string[] = [
        "Stacee Dreiling",
        "Cecil Staab",
        "Sheba Dowdy",
        "Loralee Stalker",
        "Sanjuana Kimsey",
        "Shante Hey",
        "Magen Willison",
        "Casimira Tabler",
        "Annemarie Rybicki",
        "Granville Westfall",
        "Colby Troupe",
        "Wei Frith",
        "Sarai Pilgrim",
        "Yael Rich",
        "Hester Bluhm",
        "Season Landreth",
        "Britany Saffell",
        "Kelley Babb",
        "Bradley Chumley",
        "Louella Spiker"
    ];
}