let athleteInputContainers = [];
let newPointsInputContainers = [];
let totalSimulations = 5000000;
let eliminationCount = 1;

let athleteCountInput = document.getElementById("athleteCount");
let eliminationCountInput = document.getElementById("eliminationCount");
let simulationCountInput = document.getElementById("simulationCount");

window.onload = function () { 
    const athleteDataContainer = document.getElementById("athleteDataContainer");
    const pointsContainer = document.getElementById("pointsContainer");

    athleteCountInput = document.getElementById("athleteCount");
    eliminationCountInput = document.getElementById("eliminationCount");
    simulationCountInput = document.getElementById("simulationCount");

    athleteCountInput.onload = changeAthleteInputs;
    athleteCountInput.oninput = changeAthleteInputs;
    athleteCountInput.onsubmit = changeAthleteInputs;

    eliminationCountInput.onload = onEliminationCountChange;
    eliminationCountInput.oninput = onEliminationCountChange;
    eliminationCountInput.onsubmit = onEliminationCountChange;

    simulationCountInput.onload = onSimulationCountChange;
    simulationCountInput.oninput = onSimulationCountChange;
    simulationCountInput.onsubmit = onSimulationCountChange;

    function changeAthleteInputs() {
        let athleteNo = parseInt(athleteCountInput.value);
        if (athleteNo > athleteInputContainers.length) {
            for (let i = athleteInputContainers.length; i < athleteNo; i++) {
                const nameLabel = document.createElement("label");
                nameLabel.innerHTML = `${i + 1}. `;
                nameLabel.for = `athleteNameInput${i}`;

                const nameInput = document.createElement("input");
                nameInput.type = "text";
                nameInput.id = `athleteNameInput${i}`;
                nameInput.size = 10;

                const lineBreak = document.createElement("br");

                const pointsLabel = document.createElement("label");
                pointsLabel.innerHTML = ` Total points: `;
                pointsLabel.for = `athletePointsInput${i}`;

                const pointsInput = document.createElement("input");
                pointsInput.type = "number";
                pointsInput.id = `athletePointsInput${i}`;
                pointsInput.min = 0;
                pointsInput.max = 16777215;

                athleteInputContainers.push({ 
                    nameLabel: nameLabel, 
                    nameInput: nameInput, 
                    pointsLabel: pointsLabel, 
                    pointsInput: pointsInput, 
                    lineBreak: lineBreak 
                });

                athleteDataContainer.append(nameLabel, nameInput, pointsLabel, pointsInput, lineBreak);

                const newPointsLabel = document.createElement("label");
                newPointsLabel.innerHTML = `${i + 1}${getOrdinalPostfix(i + 1)} place points: `;
                newPointsLabel.for = `newPointsInput${i}`;

                const newPointsInput = document.createElement("input");
                newPointsInput.type = "number";
                newPointsInput.id = `newPointsInput${i}`;
                newPointsInput.min = 0;
                newPointsInput.max = 16777215;

                const lineBreak2 = document.createElement("br");

                newPointsInputContainers.push({
                    label: newPointsLabel,
                    input: newPointsInput,
                    lineBreak: lineBreak2
                });

                pointsContainer.append(newPointsLabel, newPointsInput, lineBreak2);
            }
        } else if (athleteNo < athleteInputContainers.length) {
            for (let i = athleteNo; i < athleteInputContainers.length; i++) {
                for (let element in athleteInputContainers[i]) {
                    athleteDataContainer.removeChild(athleteInputContainers[i][element]);
                }
                for (let element in newPointsInputContainers[i]) {
                    pointsContainer.removeChild(newPointsInputContainers[i][element]);
                }
            }
            newPointsInputContainers.splice(athleteNo);
            athleteInputContainers = athleteInputContainers.slice(0, athleteNo);
        }

        onEliminationCountChange();
    }
}

function getOrdinalPostfix(number) {
    if (number > 20) {
        number %= 10;
    }

    switch (number) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function onEliminationCountChange() {
    if (parseInt(eliminationCountInput.value) > parseInt(athleteCountInput.value)) {
        eliminationCountInput.value = athleteCountInput.value;
    } else if (parseInt(eliminationCountInput.value) < 1) {
        eliminationCountInput.value = 1;
    }

    eliminationCount = parseInt(eliminationCountInput.value);
}

function onSimulationCountChange() {
    totalSimulations = parseInt(simulationCountInput.value);
}

class Athlete {
    constructor(name, points) {
        this.name = name;
        this.points = points;
        this.earnedPoints = 0;
        this.eliminationCount = 0;
    }

    getNewPoints() {
        return this.points + this.earnedPoints;
    }
}

function onSubmit() {
    let athletes = [];
    for (const athleteInputContainer of athleteInputContainers) {
        athletes.push(new Athlete(athleteInputContainer.nameInput.value, parseInt(athleteInputContainer.pointsInput.value)));
    }

    const newPoints = [];
    for (const newPointsInputContainer of newPointsInputContainers) {
        newPoints.push(parseInt(newPointsInputContainer.input.value));
    }
    newPoints.sort((value1, value2) => value2 - value1);
    console.log(newPoints);

    if (Number.isInteger(document.getElementById("eliminationCount").value)) {
        eliminationCount = parseInt(document.getElementById("eliminationCount").value);
    }

    for (let simulationNumber = 0; simulationNumber < totalSimulations; simulationNumber++) {
        simulateEvent(athletes, newPoints);
    }

    athletes.sort((athlete1, athlete2) => athlete2.eliminationCount - athlete1.eliminationCount);
    let result = "";
    for (const athlete of athletes) {
        result += `${athlete.name} (${(athlete.eliminationCount / totalSimulations * 100).toFixed(6)}%)\n`;
    }

    const resultsParagraph = document.getElementById("resultsParagraph");
    resultsParagraph.innerHTML = result;
}

function simulateEvent(athletes, newPoints) {
    shuffle(athletes);
    for (let i = 0; i < athletes.length; i++) {
        athletes[i].earnedPoints = newPoints[i];
    }

    athletes.sort((athlete1, athlete2) => athlete2.getNewPoints() - athlete1.getNewPoints());
    for (let i = athletes.length - eliminationCount; i < athletes.length; i++) {
        athletes[i].eliminationCount++;
    }
}

function shuffle(array) {
    let newIndex = 0;
    let currentElement = 0;
    for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
        newIndex = Math.floor(Math.random() * (currentIndex + 1));
        currentElement = array[currentIndex];
        array[currentIndex] = array[newIndex];
        array[newIndex] = currentElement;
    }
    return array;
}
