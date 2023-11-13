const testForm = document.getElementById("uploadForm");
const csvDataFile = document.getElementById("fileForUpload");

testForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvDataFile.files[0];
    Papa.parse(input, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function (csvData) {
            let output = ""
            for(let i=0;i<csvData.data.length;i++) {
                let hash = hashEmail(csvData.data[i][0]);
                if (hash.length > 4) {
                    output += hash + "\n"
                }
            }
            downloadContent(output)
        }
    });
});

function hashEmail(raw) {
    raw = raw.toLowerCase().trim().replaceAll(",","").replaceAll(";","");
    let split1 = raw.split("@");
    if (split1.length != 2) {
        return "";
    }
    let split2 = split1[0].split("+");
    let hash = sha256.create();
    hash.update(split2[0] + "@" + split1[1]);
    return hash.hex();
}

function downloadContent(content) {
    const link = document.createElement("a");
    const file = new Blob([content], { type: 'text/csv' });
    link.href = URL.createObjectURL(file);
    link.download = "email_hashes_sha256.txt";
    link.click();
    URL.revokeObjectURL(link.href);
}
