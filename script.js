document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const dob = document.getElementById('dob').value;
    if (dob) {
        calculateLifeMission(dob);
    } else {
        alert('กรุณาระบุวันเดือนปีเกิดของคุณ');
    }
});

function calculateLifeMission(dob) {
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

    const lifeMissionNumber = s3 !== 0 ? s3 : s2;
    mlist[lifeMissionNumber] += 1;
    const masterNumber = s1 % 11 === 0 ? s1 : "N/A";

    const resultHtml = generateResultHtml(lifeMissionNumber, masterNumber, mlist);
    document.getElementById('result').innerHTML = resultHtml;
}

function generateResultHtml(lifeMissionNumber, masterNumber, mlist) {
    let resultHtml = `<h2>ผลลัพธ์</h2>`;
    resultHtml += `<p>Master Number (เลขหลัก): ${masterNumber}</p>`;
    resultHtml += `<p>Life Mission (ภารกิจของชีวิต): ${lifeMissionNumber}</p>`;

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
        resultHtml += `<p>คุณมี:</p><ul>${have.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    if (missing.length) {
        resultHtml += `<p>คุณขาด:</p><ul>${missing.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    if (isoCorner.length) {
        resultHtml += `<p>คุณมี:</p><ul>${isoCorner.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    const lifeJourney = generateLifeJourney(lifeMissionNumber, mlist);
    const traitAndOilImages = getTraitAndOilImages(lifeJourney, lifeMissionNumber, mlist);

    // Show Life Mission Trait and Oil Image first
    resultHtml += `<h2>จุดแข็งและจุดอ่อนของคุณคือ:</h2>`;
    resultHtml += `<img src="${traitAndOilImages.traitImage}" alt="Trait image for Life Mission">`;
    resultHtml += `<img src="${traitAndOilImages.oilImages[lifeMissionNumber]}" alt="Oil image for Life Mission">`;

    // Show oils for the life journey next (limited to 4 oils)
    resultHtml += `<h2>น้ำมันหอมระเหยที่ช่วยเติมเต็มในเส้นทางชีวิตของคุณ: ${lifeJourney}</h2>`;
    lifeJourney.forEach(num => {
        resultHtml += `<img src="${traitAndOilImages.oilImages[num]}" alt="Oil image for Life Journey number ${num}">`;
    });

    // Display excess/over-emphasized numbers and their oils (numbers with 3 or more occurrences)
    const excessNumbers = getExcessNumbers(mlist);
    if (excessNumbers.length > 0) {
        resultHtml += `<h2>เลขที่มีจำนวนมากเกินไป (ปรากฏมากกว่า 3 ครั้ง) และน้ำมันหอมระเหยที่เกี่ยวข้อง:</h2>`;
        excessNumbers.forEach(num => {
            resultHtml += `<img src="${traitAndOilImages.oilImages[num]}" alt="Oil image for Excess number ${num}">`;
        });
    }

    return resultHtml;
}

function checkPatterns(mlist, type) {
    const patterns = [
        { label: "แถวแนวนอน 369", indices: [3, 6, 9] },
        { label: "แถวแนวนอน 258", indices: [2, 5, 8] },
        { label: "แถวแนวนอน 147", indices: [1, 4, 7] },
        { label: "แถวแนวตั้ง 123", indices: [1, 2, 3] },
        { label: "แถวแนวตั้ง 456", indices: [4, 5, 6] },
        { label: "แถวแนวตั้ง 789", indices: [7, 8, 9] },
        { label: "แนวทแยงมุม 159", indices: [1, 5, 9] },
        { label: "แนวทแยงมุม 357", indices: [3, 5, 7] }
    ];

    return patterns.filter(pattern => {
        return pattern.indices.every(index => type === 'have' ? mlist[index] > 0 : mlist[index] === 0);
    }).map(pattern => pattern.label);
}

function checkIsoCorner(mlist) {
    const isoCorner = [];

    if (mlist[5] === 0) {
        if (mlist[2] === 0 && mlist[4] === 0 && mlist[1] > 0) isoCorner.push("มุมเลข 1 แยกจากเลขอื่น");
        if (mlist[2] === 0 && mlist[6] === 0 && mlist[3] > 0) isoCorner.push("มุมเลข 3 แยกจากเลขอื่น");
        if (mlist[4] === 0 && mlist[8] === 0 && mlist[7] > 0) isoCorner.push("มุมเลข 7 แยกจากเลขอื่น");
        if (mlist[6] === 0 && mlist[8] === 0 && mlist[9] > 0) isoCorner.push("มุมเลข 9 แยกจากเลขอื่น");
    }

    return isoCorner;
}

function getTraitAndOilImages(lifeJourney, lifeMissionNumber, mlist) {
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

    return {
        traitImage: traitImages[lifeMissionNumber],  // Trait image for the Life Mission number
        oilImages: oilImages  // Oil images for the Life Mission and Life Journey numbers
    };
}

function generateLifeJourney(lifeMissionNumber, mlist) {
    const baseRow = [1, 4, 7];
    const secondRow = [2, 5, 8];
    const thirdRow = [3, 6, 9];

    const lifeJourney = [lifeMissionNumber];

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
        if (lifeJourney.length < 4 && mlist[num] > 0 && mlist[baseRow.indexOf(num)] === 0) {
            const supportNumber = secondRow[thirdRow.indexOf(num)];
            if (!lifeJourney.includes(supportNumber)) {
                lifeJourney.push(supportNumber);
            }
        }
    });

    return lifeJourney.slice(0, 4);  // Limiting to 4 oils for the life journey
}

function getExcessNumbers(mlist) {
    return mlist
        .map((count, num) => (num >= 1 && num <= 9 && count >= 3) ? num : null)
        .filter(num => num !== null);
}
