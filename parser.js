const fs = require('fs')
const readline = require('readline')

const dataFile = './raw-data-file.csv'

const characters = {
    undefined: 'Confucius',
    1: 'Baruch Spinoza',
    2: 'Epicurus',
    3: 'Simone de Beauvoir',
    4: 'Augustine of Hippo',
    5: 'Francis Bacon',
    6: 'Laozi',
    7: 'Friedrich Nietzsche',
}

const results = {
    totalGames: 0,
    players2: {
        characterTotals: {
            total: 0,
            Confucius: 0,
            'Baruch Spinoza': 0,
            Epicurus: 0,
            'Simone de Beauvoir': 0,
            'Augustine of Hippo': 0,
            'Francis Bacon': 0,
            Laozi: 0,
            'Friedrich Nietzsche': 0,
        },
    },
    players3: {
        characterTotals: {
            total: 0,
            Confucius: 0,
            'Baruch Spinoza': 0,
            Epicurus: 0,
            'Simone de Beauvoir': 0,
            'Augustine of Hippo': 0,
            'Francis Bacon': 0,
            Laozi: 0,
            'Friedrich Nietzsche': 0,
        },
    },
    players4: {
        characterTotals: {
            total: 0,
            Confucius: 0,
            'Baruch Spinoza': 0,
            Epicurus: 0,
            'Simone de Beauvoir': 0,
            'Augustine of Hippo': 0,
            'Francis Bacon': 0,
            Laozi: 0,
            'Friedrich Nietzsche': 0,
        },
    },
}

async function readFile(file) {
    let lineNumber = 0

    const lineReader = readline.createInterface({
        input: fs.createReadStream(file),
    })

    lineReader.on('line', async line => {
        lineNumber++

        if (lineNumber === 1) {
            console.log(line)
        }

        if (lineNumber > 1) {
            const splitLine = line.split(';')

            const gameState = JSON.parse(
                splitLine[3].replace(/""/g, '"').slice(1, -1)
            )

            const charactersInGame = []

            const winner = gameState.C.P.reduce(
                (acc, player) => {
                    charactersInGame.push(player.Ch)
                    if (player.Pt > acc[0]) {
                        return [player.Pt, characters[player.Ch]]
                    } else return acc
                },
                [0, 'nobody']
            )

            charactersInGame.sort((a, b) => {
                return a - b
            })

            const characterCode = charactersInGame.join('')

            if (!results[`players${gameState.C.P.length}`][characterCode]) {
                results[`players${gameState.C.P.length}`][characterCode] = {}
                results[`players${gameState.C.P.length}`][
                    characterCode
                ].total = 0
                // have to account for null character
                if (gameState.C.P.length !== characterCode.length)
                    results[`players${gameState.C.P.length}`][characterCode][
                        characters[undefined]
                    ] = 0
                for (let i of characterCode) {
                    results[`players${gameState.C.P.length}`][characterCode][
                        characters[i]
                    ] = 0
                }
            }

            results.totalGames++

            results[`players${gameState.C.P.length}`]['characterTotals'][
                'total'
            ]++

            results[`players${gameState.C.P.length}`]['characterTotals'][
                winner[1]
            ]++

            results[`players${gameState.C.P.length}`][characterCode].total++

            results[`players${gameState.C.P.length}`][characterCode][
                winner[1]
            ]++
        }
    })

    return new Promise(resolve => {
        lineReader.on('close', () => resolve())
    })
}

async function addPercents() {
    return new Promise(resolve => {
        for (let i = 2; i <= 4; i++) {
            const sets = Object.keys(results[`players${i}`])

            sets.forEach(set => {
                const characters = Object.keys(results[`players${i}`][set])
                characters.forEach(character => {
                    if (character !== 'total')
                        results[`players${i}`][set][character] =
                            `${results[`players${i}`][set][character]} (` +
                            (
                                (results[`players${i}`][set][character] /
                                    results[`players${i}`][set].total) *
                                100
                            ).toFixed(0) +
                            '%)'
                })
            })
        }

        resolve()
    })
}

async function moveCharactersToArray() {
    return new Promise(resolve => {
        for (let i = 2; i <= 4; i++) {
            const sets = Object.keys(results[`players${i}`])

            sets.forEach(set => {
                const characters = Object.keys(results[`players${i}`][set])

                results[`players${i}`][set].characters = []

                characters.forEach(character => {
                    if (character !== 'total') {
                        results[`players${i}`][set].characters.push({
                            [character]: results[`players${i}`][set][character],
                        })
                        delete results[`players${i}`][set][character]
                    }
                })

                // sort characters
                results[`players${i}`][set].characters.sort((a, b) => {
                    const keyA = Object.keys(a)
                    const keyB = Object.keys(b)

                    const numberA = parseInt(
                        a[keyA].slice(0, a[keyA].indexOf(' '))
                    )
                    const numberB = parseInt(
                        b[keyB].slice(0, b[keyB].indexOf(' '))
                    )
                    return numberB - numberA
                })
            })
        }

        resolve()
    })
}

/* SCRIPT STARTS HERE */

async function script() {
    const startTime = Date.now()

    console.log(`startTime: ${startTime}`)

    await readFile(dataFile)

    await addPercents()

    await moveCharactersToArray()

    console.log(`results:`)
    console.log(JSON.stringify(results))

    const endTime = Date.now()
    console.log(`Seconds elapsed: ${(endTime - startTime) / 1000}`)
    console.log(`milliseconds elapsed: ${endTime - startTime}`)
}

script()
