document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const dob = document.getElementById('dob').value;
    if (dob) {
        calculateLifePath(dob);
    } else {
        alert('Please enter a valid date of birth.');
    }
});

function calculateLifePath(dob) {
    const dobDate = new Date(dob);
    const day = dobDate.getDate().toString().padStart(2, '0');
    const month = (dobDate.getMonth() + 1).toString().padStart(2, '0');
    const year = dobDate.getFullYear().toString();

    let s1 = 0, s2 = 0, s3 = 0;
    let mlist = Array(10).fill(0);

    for (const char of day + month + year) {
        const digit = parseInt(char);
        s1 += digit;
        mlist[digit] += 1;
    }

    for (const char of s1.toString()) {
        const digit = parseInt(char);
        s2 += digit;
        mlist[digit] += 1;
    }

    if (s2 >= 10) {
        for (const char of s2.toString()) {
            const digit = parseInt(char);
            s3 += digit;
        }
    }

    const lifePathNumber = s3 !== 0 ? s3 : s2;
    mlist[lifePathNumber] += 1;
    const masterNumber = s1 % 11 === 0 ? s1 : "N/A";

    const resultHtml = generateResultHtml(lifePathNumber, masterNumber, mlist);
    document.getElementById('result').innerHTML = resultHtml;
}

function generateResultHtml(lifePathNumber, masterNumber, mlist) {
    let resultHtml = `<h2>Results</h2>`;
    resultHtml += `<p>Life Mission: ${lifePathNumber}</p>`;
    resultHtml += `<p>Master Number: ${masterNumber}</p>`;

    // Generate the Life Matrix
    resultHtml += `<div class="matrix">`;
    const matrixOrder = [3, 6, 9, 2, 5, 8, 1, 4, 7];
    matrixOrder.forEach(num => {
        resultHtml += `<div class="matrix-cell">${mlist[num] > 0 ? num.toString().repeat(mlist[num]) : ''}</div>`;
    });
    resultHtml += `</div>`;

    const have = checkPatterns(mlist, 'have');
    const missing = checkPatterns(mlist, 'missing');
    const isoCorner = checkIsoCorner(mlist);

    if (have.length) {
        resultHtml += `<p>You have:</p><ul>${have.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    if (missing.length) {
        resultHtml += `<p>You are missing:</p><ul>${missing.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    if (isoCorner.length) {
        resultHtml += `<p>You have:</p><ul>${isoCorner.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    const traitAndOilImages = getTraitAndOilImages(lifePathNumber, mlist);
    resultHtml += `<p>The following traits and suggested oils can support your life mission:</p>`;
    resultHtml += `<img src="${traitAndOilImages.traitImage}" alt="Trait image">`;
    resultHtml += `<img src="${traitAndOilImages.oilImage}" alt="Oil image">`;

    const lifeJourney = generateLifeJourney(lifePathNumber, mlist);

    resultHtml += `<h2>The following oils support your life journey: ${lifeJourney.join('')}</h2>`;
    traitAndOilImages.additionalOils.forEach(oilImage => {
        resultHtml += `<img src="${oilImage}" alt="Oil image">`;
    });

    

    return resultHtml;
}

function checkPatterns(mlist, type) {
    const patterns = [
        { label: "Row 369", indices: [3, 6, 9] },
        { label: "Row 258", indices: [2, 5, 8] },
        { label: "Row 147", indices: [1, 4, 7] },
        { label: "Column 123", indices: [1, 2, 3] },
        { label: "Column 456", indices: [4, 5, 6] },
        { label: "Column 789", indices: [7, 8, 9] },
        { label: "Diagonal 159", indices: [1, 5, 9] },
        { label: "Diagonal 357", indices: [3, 5, 7] }
    ];

    return patterns.filter(pattern => {
        return pattern.indices.every(index => type === 'have' ? mlist[index] > 0 : mlist[index] === 0);
    }).map(pattern => pattern.label);
}

function checkIsoCorner(mlist) {
    const isoCorner = [];

    if (mlist[5] === 0) {
        if (mlist[2] === 0 && mlist[4] === 0 && mlist[1] > 0) isoCorner.push("Isolated corner 1");
        if (mlist[2] === 0 && mlist[6] === 0 && mlist[3] > 0) isoCorner.push("Isolated corner 3");
        if (mlist[4] === 0 && mlist[8] === 0 && mlist[7] > 0) isoCorner.push("Isolated corner 7");
        if (mlist[6] === 0 && mlist[8] === 0 && mlist[9] > 0) isoCorner.push("Isolated corner 9");
    }

    return isoCorner;
}

function getTraitAndOilImages(lifePathNumber, mlist) {
    const traitImages = {
        1: 'images/traitimage1.jpg',
        2: 'images/traitimage2.jpg',
        3: 'images/traitimage3.jpg',
        4: 'images/traitimage4.jpg',
        5: 'images/traitimage5.jpg',
        6: 'images/traitimage6.jpg',
        7: 'images/traitimage7.jpg',
        8: 'images/traitimage8.jpg',
        9: 'images/traitimage9.jpg',
    };

    const oilImages = {
        1: 'images/oilimage1.jpg',
        2: 'images/oilimage2.jpg',
        3: 'images/oilimage3.jpg',
        4: 'images/oilimage4.jpg',
        5: 'images/oilimage5.jpg',
        6: 'images/oilimage6.jpg',
        7: 'images/oilimage7.jpg',
        8: 'images/oilimage8.jpg',
        9: 'images/oilimage9.jpg',
    };

    const additionalOils = [];
    for (let i = 1; i <= 9; i++) {
        if (mlist[i] === 0) {
            additionalOils.push(oilImages[i]);
        }
    }

    return {
        traitImage: traitImages[lifePathNumber],
        oilImage: oilImages[lifePathNumber],
        additionalOils: additionalOils
    };
}

function generateLifeJourney(lifePathNumber, mlist) {
    const baseRow = [1, 4, 7];
    const secondRow = [2, 5, 8];
    const thirdRow = [3, 6, 9];

    const lifeJourney = [lifePathNumber];

    // Function to check missing numbers in a row and add them to the journey
    const checkRow = (row) => {
        row.forEach(num => {
            if (lifeJourney.length < 4 && mlist[num] === 0 && lifeJourney.indexOf(num) === -1) {
                lifeJourney.push(num);
            }
        });
    };

    // Start from the base row, then second row, then third row
    checkRow(baseRow);
    checkRow(secondRow);
    checkRow(thirdRow);

    // Check if there's a need for a support number from the second row if any number from the third row is present
    thirdRow.forEach(num => {
        if (lifeJourney.length < 4 && mlist[num] > 0 && lifeJourney.indexOf(num) === -1) {
            const supportNumber = num - 1;
            if (mlist[supportNumber] === 0 && lifeJourney.indexOf(supportNumber) === -1) {
                lifeJourney.push(supportNumber);
            }
        }
    });

    // Ensure the life journey is limited to 4 digits
    return lifeJourney.slice(0, 4);
}

