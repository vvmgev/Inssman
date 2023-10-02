export const readFile = (file, callback) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      callback(event?.target?.result)
    };
    fileReader.readAsText(file);
}