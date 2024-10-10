function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const lcs = [];

    // Calculate LCS length and build the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to find the actual LCS
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs.unshift(text1[i - 1]); // Prepend to the result
            i--;
            j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    return {
        length: dp[m][n],
        sequence: lcs.join('')
    };
}

function processFiles(file1, file2) {
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function(event) {
        const text1 = event.target.result.replace(/[^\w\s]|_/g, "").toLowerCase();
        
        reader2.onload = function(event) {
            const text2 = event.target.result.replace(/[^\w\s]|_/g, "").toLowerCase();
            const { length: lcsLength, sequence: lcsSequence } = longestCommonSubsequence(text1, text2);
            const similarityScore = (lcsLength / Math.max(text1.length, text2.length)) * 100;

            document.getElementById('lcsLength').innerText = `LCS Length: ${lcsLength}`;
            document.getElementById('similarityScore').innerText = `Similarity Score: ${similarityScore.toFixed(2)}%`;
            highlightMatchedSegments(text1, text2, lcsSequence);
        };
        reader2.readAsText(file2);
    };

    reader1.readAsText(file1);
}

function highlightMatchedSegments(text1, text2, lcsSequence) {
    if (lcsSequence.length === 0) {
        document.getElementById('matchedSegments').innerHTML = `
            <strong>Text 1:</strong><br>
            <div>No matched segments to show</div>
            <strong>Text 2:</strong><br>
            <div>No matched segments to show</div>
        `;
        return;
    }

    let index = 0;
    const highlightedText1 = text1.split('').map(char => {
        if (lcsSequence[index] === char) {
            index++;
            return `<span class="highlight">${char}</span>`;
        }
        return char;
    }).join('');

    index = 0; // Reset for second text
    const highlightedText2 = text2.split('').map(char => {
        if (lcsSequence[index] === char) {
            index++;
            return `<span class="highlight">${char}</span>`;
        }
        return char;
    }).join('');

    document.getElementById('matchedSegments').innerHTML = `
        <strong>Text 1:</strong><br>
        <div>${highlightedText1}</div>
        <strong>Text 2:</strong><br>
        <div>${highlightedText2}</div>
    `;
}

document.getElementById('checkPlagiarism').addEventListener('click', () => {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];
    if (file1 && file2) {
        processFiles(file1, file2);
    } else {
        alert('Please upload both files.');
    }
});

document.getElementById('checkDNA').addEventListener('click', () => {
    const dna1 = document.getElementById('dna1').value.trim();
    const dna2 = document.getElementById('dna2').value.trim();
    if (dna1 && dna2) {
        const { length: lcsLength, sequence: lcsSequence } = longestCommonSubsequence(dna1, dna2);
        const similarityScore = (lcsLength / Math.max(dna1.length, dna2.length)) * 100;

        document.getElementById('lcsLength').innerText = `LCS Length: ${lcsLength}`;
        document.getElementById('similarityScore').innerText = `Similarity Score: ${similarityScore.toFixed(2)}%`;
        highlightMatchedSegments(dna1, dna2, lcsSequence);
    } else {
        alert('Please enter both DNA sequences.');
    }
});