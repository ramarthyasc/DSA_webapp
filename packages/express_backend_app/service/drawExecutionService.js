exports.executeCodeFile = (spawn, path, fs, codeFolderPath, codeFilePath, codeLanguage) => {
  const fileName = path.basename(codeFilePath).split(".")[0];
  console.log(codeFilePath)
  let outputChunks = [];
  let stderrChunks = [];
  let output = "";
  let stderr = "";

  // This is parallel processing : where - it's like event handler api of the browser - 
  // where we subscribe and we get notifications (runs the defined functions) when it event publishes

  return new Promise((res, rej) => {

    if (codeLanguage === "c") {

      // NOTE: The code should be run (spawning the 'run' subprocess ) only after 'compile' subprocess is done ie; is resolved
      //
      const compileProcess = new Promise((resolve, reject) => {
        // spawn means  - run the command - but without using shell. ie' directly running the binary without the use of shell
        const compile = spawn('gcc', [codeFilePath, "-o", path.join(codeFolderPath, fileName)]);

        compile.on('error', (err) => {
          console.error("compile subprocess failed to start ");
          reject(err);
        })

        compile.stdout.on('data', (data) => {
          //won't give any output data - as it's just compilation - so don't need this function generally
          console.log("compile stdout: ", data);
        })

        compile.stderr.on('data', (data) => {
          stderrChunks.push(data);
        })

        compile.on('close', (code) => {
          // Here we know if the subprocess was run correct and exited with status code 0 (universal SUCCESS CODE) or not
          if (code !== 0) {
            stderr = stderrChunks.concat().toString();
            reject(stderr);
          }

          // after compilation successful or unsuccessful delete the source file NOTE: You can undo this - if you need this state
          fs.rmSync(codeFilePath);

          // after the above code, the below code also runs, but resolve() won't have any effect
          console.error("compile subprocess stderr: ", stderr);
          console.log("compile subprocess exited with code: ", code);
          resolve();
        })

      })

      compileProcess
        .then(() => {
          console.log("Hey i got the resolve of compile process. ie; compile process is done")

          const run = spawn(path.join(codeFolderPath, fileName));
          stderrChunks = [];

          run.on('error', (err) => {
            console.error("run subprocess failed to start ");
            rej(err);
          })
          // 'run' child process
          run.stdout.on('data', (data) => {
            // outputChunks of buffers will be sent to us. We collect it in an array
            outputChunks.push(data);
          })

          run.stderr.on('data', (data) => {
            stderrChunks.push(data);
          })

          run.on('close', (code) => {

            if (code !== 0) {
              stderr = stderrChunks.concat().toString();
              rej(stderr);
            }
            // after the above code, the below code also runs, but resolve() won't have any effect

            // delete the binary file if it ran successful or not --- NOTE: You can undo this - if you need this state
            fs.rmSync(path.join(codeFolderPath, fileName));

            // concats a number of buffer outputChunks in an array into one buffer, then Stringify it to get eg: "[1,2,3]" - which we should parse to get [1,2,3]
            console.error("run subprocess stderr: ", stderr);
            console.log("run subprocess exited with code: ", code);
            output = Buffer.concat(outputChunks).toString();
            res(output); // The Promise will give the resolve only when the event handler closes
          })
        })
        .catch((error) => {
          rej(error);
        })



    } else if (codeLanguage === "js") {

      const run = spawn("node", [codeFilePath]);

      run.on('error', (err) => {
        console.error("run subprocess failed to start ");
        rej(err);
      })

      run.stdout.on('data', (data) => {
        outputChunks.push(data);
      })
      run.stderr.on('data', (data) => {
        stderrChunks.push(data);
      })
      run.on('close', (code) => {
        if (code !== 0) {
          stderr = stderrChunks.concat().toString();
          rej(stderr);
        }
        // after the above code, the below code also runs, but resolve() won't have any effect

        // delete the source file if it ran successful or not NOTE: You can undo this - if you need this state
        fs.rmSync(codeFilePath);

        // concats a number of buffer outputChunks in an array into one buffer, then Stringify it to get eg: "[1,2,3]" - which we should parse to get [1,2,3]
        console.error("run subprocess stderr: ", stderr);
        console.log("run subprocess exited with code: ", code);
        output = Buffer.concat(outputChunks).toString();
        res(output); // The Promise will give the resolve only when the event handler closes
      })


    }
  })

}
