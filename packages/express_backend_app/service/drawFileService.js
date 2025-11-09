exports.generateCodeFile = (fs, path, uuid, codeFolderPath, codeData, codeLanguage) => {

  const codeFilePath = path.join(codeFolderPath, `${uuid()}.${codeLanguage}`);
  fs.writeFileSync(codeFilePath, codeData);
  return codeFilePath;

}
