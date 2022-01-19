const fileSaveStatus = {
    SUCCESSFUL: 0,
    ABORTED: 1,
    FAILED: 2
};

const filePickerOptions = {
    types: [
        {
            description: 'Javascript object notation',
            accept: { 'application/json': ['.json'] }
        }
    ]
}

// Saving a json file
const saveAsJson = async (data) => {
    let fileStream;
    try {
        const fileHandle = await window.showSaveFilePicker(filePickerOptions);
        fileStream = await fileHandle.createWritable();
        await fileStream.write(new Blob([JSON.stringify(data)], {type: 'application/json'}));

    } catch (e) {
        // Check if user clicked cancel
        if (e instanceof AbortSignal) {
            return fileSaveStatus.ABORTED;
        }
        return fileSaveStatus.FAILED;
    } finally {
        // close the file stream
        if (fileStream) {
            await fileStream.close();
        }
    }
    
    return fileSaveStatus.SUCCESSFUL;
};

// Opening a file, then parsing it and returning the value
const openJson = async () => {
    try {
        const [fileHandle] = await window.showOpenFilePicker(filePickerOptions);
        const file = await fileHandle.getFile();
        const obj = await file.text().then(raw => JSON.parse(raw));
        return obj;
    } catch (e) {
        if (e instanceof AbortSignal) {
            return null;
        }
        throw e;
    }
};

// The data that we are going to save. could be anything
const dataToSave = {
    arg1: 'wfhwofh',
    arg2: true,
    arg3: [
        1, 2, 3, 4
    ]
};

// is called from onclick on save button
const saveAction = () => {
    saveAsJson(dataToSave).then(status => console.log(`status: ${status}`));
};

// is called from onclick on open button
const openAction = () => {
    // use then because we are returning a promise
    openJson().then(object => console.log(object));
};