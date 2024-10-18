import 'animate.css';
function longestCommonSubsequence(words1, words2) {
    const m = words1.length, n = words2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const lcs = [];

    // Calculate LCS length and build the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (words1[i - 1] === words2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to find the actual LCS
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (words1[i - 1] === words2[j - 1]) {
            lcs.unshift(words1[i - 1]); // Prepend to the result
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
        sequence: lcs
    };
}

function processFiles(file1, file2) {
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function(event) {
        const text1 = event.target.result.replace(/[^\w\s]|_/g, "").toLowerCase();
        const words1 = text1.split(/\s+/);

        reader2.onload = function(event) {
            const text2 = event.target.result.replace(/[^\w\s]|_/g, "").toLowerCase();
            const words2 = text2.split(/\s+/);
            
            const { length: lcsLength, sequence: lcsSequence } = longestCommonSubsequence(words1, words2);
            const similarityScore = (lcsLength / Math.max(words1.length, words2.length)) * 100;

            document.getElementById('lcsLength').innerText = `LCS Length: ${lcsLength}`;
            document.getElementById('similarityScore').innerText = `Similarity Score: ${similarityScore.toFixed(2)}%`;
            highlightMatchedSegments(words1, words2, lcsSequence);
        };
        reader2.readAsText(file2);
    };

    reader1.readAsText(file1);
}

function highlightMatchedSegments(words1, words2, lcsSequence) {
    if (lcsSequence.length === 0) {
        document.getElementById('matchedSegments').innerHTML = `
            <strong>Text 1:</strong><br>
            <div>No matched segments to show</div>
            <strong>Text 2:</strong><br>
            <div>No matched segments to show</div>
        `;
        return;
    }

    // Highlight matched words in both texts
    const highlightedText1 = words1.map(word => {
        return lcsSequence.includes(word) ? `<span class="highlight">${word}</span>` : word;
    }).join(' ');

    const highlightedText2 = words2.map(word => {
        return lcsSequence.includes(word) ? `<span class="highlight">${word}</span>` : word;
    }).join(' ');

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

