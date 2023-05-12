import fs from 'fs'
const DB_FILE_PATH = './core/db'

function create(contet: string) {
  fs.writeFileSync(DB_FILE_PATH, contet)
  return contet
}

function read() {
  const readFile = fs.readFileSync(DB_FILE_PATH)

  console.log(readFile)
}

create('Testeeee')
// read()