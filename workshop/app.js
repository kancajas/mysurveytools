//JSONBin API Codes


//Create Bin
fetch(url, {
    method: "POST",
    body: JSON.stringify(arr),
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "secret-key": rowId,
        "collection-id": colId,
        "name": jobNo
    }
}).then(function(response) {
    if (response.ok) {
        return response.json();
    }