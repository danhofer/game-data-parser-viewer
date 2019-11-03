const dataDiv = document.getElementById('data-div')
const data = JSON.parse(dataDiv.innerText)
dataDiv.parentNode.removeChild(dataDiv)

const results = {}
const selection = []

let gamesGrandTotal = 0

const resultsDiv = document.getElementById('results-div')

const submitButton = document.getElementById('submit-button')
submitButton.disabled = true

const checkboxDiv = document.getElementById('checkbox-div')
checkboxDiv.addEventListener('click', event => {
    if (event.target.value && event.target.value !== 'Add (press enter)') {
        if (event.target.checked) selection.push(event.target.value)
        else selection.splice(selection.indexOf(event.target.value), 1)

        if (selection.length < 2 || selection.length > 4)
            submitButton.disabled = true
        else submitButton.disabled = false
    }
})

checkboxDiv.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !submitButton.disabled) {
        createOutput(selection)
        displayResults()
    }
})

submitButton.addEventListener('click', () => {
    createOutput(selection)
    displayResults()
})

function buildText(players, characterCode) {
    let prettyLine = ''
    let totalGames = 0

    totalGames += data[`players${players}`][characterCode].total
    data[`players${players}`][characterCode].characters.forEach(character => {
        prettyLine += ` - ${JSON.stringify(character)
            .replace(/"|{|}/g, '')
            .replace(/:/, ': ')}<br>`
    })
    gamesGrandTotal += totalGames
    return `Games played: ${totalGames}<br>${prettyLine}<br>`
}

function createOutput(selection) {
    const characters = JSON.parse(JSON.stringify(selection))

    const players = characters.length

    const nullIndex = characters.indexOf('null')

    if (nullIndex >= 0) characters.splice(nullIndex, 1)
    const characterCode = characters
        .sort((a, b) => {
            return a - b
        })
        .join('')

    const divCode = `${players}-${characterCode}`

    if (results[divCode]) {
        gamesGrandTotal -= data[`players${players}`][characterCode].total
        delete results[divCode]
    }

    results[divCode] = buildText(players, characterCode)

    return
}

function displayResults() {
    resultsDiv.innerHTML = ''

    const resultKeys = Object.keys(results)

    const grandTotalDiv = document.createElement('div')
    grandTotalDiv.setAttribute('id', 'grandTotal')
    grandTotalDiv.innerHTML = `Grand total of all games listed: ${gamesGrandTotal}`
    resultsDiv.appendChild(grandTotalDiv)

    resultKeys.forEach(divCode => {
        const newDiv = document.createElement('div')
        newDiv.setAttribute('id', divCode)

        const newButton = document.createElement('button')
        newButton.setAttribute('id', `${divCode}-button`)
        newButton.innerText = 'Remove'

        newDiv.appendChild(newButton)

        newDiv.innerHTML += '<br>' + results[divCode]
        resultsDiv.appendChild(newDiv)

        document
            .getElementById(`${divCode}-button`)
            .addEventListener('click', () => {
                const [players, characterCode] = divCode.split('-')
                gamesGrandTotal -=
                    data[`players${players}`][characterCode].total
                resultsDiv.removeChild(document.getElementById(divCode))
                delete results[divCode]
                displayResults()
            })
    })
}
