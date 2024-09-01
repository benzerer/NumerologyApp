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
    let mlist = Array(10).fill(0).map(() => [0, 0, 0]);

    for (const char of day + month + year) {
        const digit = parseInt(char);
        s1 += digit;
        mlist[digit][0] += 1;
    }

    for (const char of s1.toString()) {
        const digit = parseInt(char);
        s2 += digit;
        mlist[digit][0] += 1;
    }

    if (s2 >= 10) {
        for (const char of s2.toString()) {
            const digit = parseInt(char);
            s3 += digit;
            mlist[digit][0] += 1;
        }
    }

    const lifePathNumber = s3 !== 0 ? s3 : s2;
    const masterNumber = s1 % 11 === 0 ? s1 : "N/A";

    const resultHtml = generateResultHtml(lifePathNumber, masterNumber, mlist);
    document.getElementById('result').innerHTML = resultHtml;
}

function generateResultHtml(lifePathNumber, masterNumber, mlist) {
    let resultHtml = `<h2>Results</h2>`;
    resultHtml += `<p>Life Path: ${lifePathNumber}</p>`;
    resultHtml += `<p>Master Number: ${masterNumber}</p>`;

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
    resultHtml += `<p>Based on your life path number, your traits and suggested oils to use:</p>`;
    resultHtml += `<img src="${traitAndOilImages.traitImage}" alt="Trait image">`;
    resultHtml += `<img src="${traitAndOilImages.oilImage}" alt="Oil image">`;

    resultHtml += `<p>Based on your life matrix, some of your numbers may be overemphasized, while some may be missing, your suggested oils to use:</p>`;
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
        return pattern.indices.every(index => type === 'have' ? mlist[index][0] > 0 : mlist[index][0] === 0);
    }).map(pattern => pattern.label);
}

function checkIsoCorner(mlist) {
    const isoCorner = [];

    if (mlist[5][0] === 0) {
        if (mlist[2][0] === 0 && mlist[4][0] === 0 && mlist[1][0] > 0) isoCorner.push("Isolated corner 1");
        if (mlist[2][0] === 0 && mlist[6][0] === 0 && mlist[3][0] > 0) isoCorner.push("Isolated corner 3");
        if (mlist[4][0] === 0 && mlist[8][0] === 0 && mlist[7][0] > 0) isoCorner.push("Isolated corner 7");
        if (mlist[6][0] === 0 && mlist[8][0] === 0 && mlist[9][0] > 0) isoCorner.push("Isolated corner 9");
    }

    return isoCorner;
}

function getTraitAndOilImages(lifePathNumber, mlist) {
    const traitImages = {
        1: 'https://lh3.google.com/u/1/d/1Tj8VS6eLOLJxNX_tvKBva4gv-6pcffSd=w632-h933-iv1',
        2: 'https://lh3.google.com/u/1/d/15S0mdZdN9m_BxZH4IxswJ_XzOGWRjaS-=w632-h933-iv1',
        3: 'https://lh3.google.com/u/1/d/17YG7Q7I2ayz0VOdMqkD2Qxib715ILpq9=w632-h933-iv1',
        4: 'https://lh3.google.com/u/1/d/1fkSeI5znYW64rU8HuaHeOZQ-lIIL4uyn=w632-h933-iv1',
        5: 'https://lh3.google.com/u/1/d/1jZZcP3KBPOJaYYuzpS4SJIGy6xItE02s=w632-h933-iv1',
        6: 'https://lh3.google.com/u/1/d/17DJKlR2mav3EhPUh1RwJY68Ie4BjotYo=w632-h933-iv1',
        7: 'https://lh3.google.com/u/1/d/1YLis-L2MZoe-BJ4N7hGsYUBNSUWwaRtl=w632-h933-iv1',
        8: 'https://lh3.google.com/u/1/d/1OTa80LKu2t9x66X_C0jrbtR9GlNYNpbs=w632-h933-iv1',
        9: 'https://lh3.google.com/u/1/d/1opjSFWMwLv0Tqhc1dSqakUKojWx6pca8=w632-h933-iv1'
    };

    const oilImages = {
        1: 'https://lh3.google.com/u/1/d/1EYLgqmKcbMCVQ4W2yBPZPiH2g-lcAYEU=w1920-h933-iv1',
        2: 'https://lh3.google.com/u/1/d/1K3fG3aAf3CUj5XepCbDGrPnCSHgZ66ql=w632-h933-iv1',
        3: 'https://lh3.google.com/u/1/d/1nW_UZE-Vi0awslJ0yJfD-lnDCpjiiutT=w1920-h901-iv1',
        4: 'https://lh3.google.com/u/1/d/1oenpx2LMixJ4_ZRY91d8qSV3Yj27wScl=w1920-h901-iv1',
        5: 'https://lh3.google.com/u/1/d/10neh1LQlXVR5s1DPn4f1uRNx-J7eiPqH=w1056-h901-iv1',
        6: 'https://lh3.google.com/u/1/d/1HYvWINt7ZqOf21HtveZyiaZjAle-8aEx=w1056-h901-iv1',
        7: 'https://lh3.google.com/u/1/d/15pe87_n2W1NKFPwNO7FfdL3gU8l5PESQ=w1056-h901-iv1',
        8: 'https://lh3.google.com/u/1/d/19w41VyP5Alpk_sWwNMlG1tHHx8cyRufp=w1056-h901-iv1',
        9: 'https://lh3.google.com/u/1/d/1loQpbKYK_N42LjyqDNTaBlnTChJkpzAv=w1056-h901-iv1'
    };

    const additionalOils = [];
    for (let i = 1; i <= 9; i++) {
        if (mlist[i][0] === 0) {
            additionalOils.push(oilImages[i]);
        }
    }

    return {
        traitImage: traitImages[lifePathNumber],
        oilImage: oilImages[lifePathNumber],
        additionalOils: additionalOils
    };
}

