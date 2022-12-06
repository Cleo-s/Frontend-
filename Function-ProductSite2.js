/**
 * @param {*} inputForm - form element
 * @param {*} file - input with type="file"
 * @param {*} filterInput - input filter word
 */
 const inputForm = document.getElementById("input-form")
 const file = document.getElementById("file-choose")
 const filterInput = document.getElementById("test-input")
 const dataTable = document.getElementById("data-table")
 const emptyMessage = document.getElementById('empty-message')
 const dateInput = document.getElementById("date-input")
 const rowLimiter = document.getElementById("row-limiter")
 const timeInput = document.getElementById("time-input")
 const chosenFile = document.getElementById("chosen-file")
 
 /**
  * @param {*} table - creating element table 
  * @param {*} thead - creating element table header
  * @param {*} tbody - creating element table body
  */
 
 /**
  * @function csvToArray - function that converts csv file data into an array
  * @param {string} str 
  * @param {char} delimiter 
  * @return {Array} Array with all information from file
  */
 
 function csvToArray(str, delimiter = ',') {
    /**
     * @param {Array} headers - array, is created from the first row elements. String slices from index 0, to index of first '\n'
     * @param {Array} rows - array of rows. Each row - object with key:value
     * */
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter)
    const rows = str.slice(str.indexOf("\n") + 1).split("\n")
 
    // As last element of headers is '\r', it erases
    headers.pop()
 
    /**
     * @param {Array} arr - Data array. Includes objects with data as array elements
     * @param {Array} values - Values from the row splitted by separator '-'
     * @param {Object} element - Object that appears from headers Array as setting key:value 
     * @return {Array} arr - Result array
     * 
     */
    const arr = rows.map((row) => {
       const values = row.split(delimiter)
       const element = headers.reduce((object, header, index) => {
          object[header] = values[index]
          return object
       }, {})
       return element
    })
 
    return [arr, headers]
 }
 
 /**
  * 
  * @param {Array} data - Array of objects 
  * @returns {Array} initialArray - Array of arrays, each element of whom - is array with two specific values
  * 
  * As by the assignment table has to print only two dates first, we fill array with arrays of those two dates from each object
  */
 
 function getFilters(data) {
    const prodCode = document.getElementById('ProdCode')
    const customer = document.getElementById('Customer')
    const prodName = document.getElementById('ProdName')
    const hostName = document.getElementById('HostName')
    const matNum = document.getElementById('MatNum')
    const articleNum = document.getElementById('ArticleNum')
    const wkstname = document.getElementById('WkStNmae')
    const adpNum = document.getElementById('AdpNum')
    const procName = document.getElementById('ProcName')
    const avo = document.getElementById('AVO')
 
    const headers = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO"]
    const filters = [prodCode, customer, prodName, hostName, matNum, articleNum, wkstname, adpNum, procName, avo]
 
    const filteredArray = []
 
    // Check which headers are present
    const presentHeaders = filters.map((item, index) => {
       if (item.value.length != 0)
          return headers[index]
    })
 
    data.forEach((dElem, index) => {
       presentHeaders.forEach((item, index) => {
          if (item != undefined) {
             if (dElem[item] == document.getElementById(`${item}`).value)
                filteredArray.push([dElem])
          }
       })
    })
 
    filteredArray.unshift(headers)
 
    console.log(presentHeaders)
    console.log(filteredArray)
 
    return [filteredArray, presentHeaders]
 }
 
 file.oninput = (e) => {
    e.preventDefault()
 
    const arrFromFileName = file.value.replaceAll('\\', ',').split(',')
 
    chosenFile.innerHTML = arrFromFileName[arrFromFileName.length - 1]
 }
 
 inputForm.addEventListener("submit", (e) => {
    /**
     * e.preventDefault() - prevents reload when click Submit button
     */
    e.preventDefault()
 
    // A files property returnes files list. So [0] will return us first file
    const input = file.files[0]
 
    /**
     * @param table - table element. Will be used to append thead and tbody
     * @param thead - table header element. Will be used to append tr and th inside
     * @param tbody - table body element. Will be used to append tr and td inside
     * @param reader - FileReader variable. Will be used to work with file
     */
    let table = document.createElement("table")
    let thead = document.createElement("thead")
    let tbody = document.createElement("tbody")
    const reader = new FileReader()
 
    // Check if file chosen or not. If not - prints following message
    if (file.value == '') {
       emptyMessage.innerHTML = "Datei nicht ausgewählt"
 
       dataTable.innerHTML = ''
    }
    else {
       const arrFromFileName = file.value.replaceAll('\\', ',').split(',')
 
       reader.onload = function (e) {
          // Recieving table info in text form separated with coma
          const text = e.target.result
 
          // If recieved file is empty, message with be revealed with file name
          if (text.length === 0) {
             if (file.DOCUMENT_NODE > 0) {
                dataTable.innerHTML = ''
                table.innerHTML = ''
                thead.innerHTML = ''
                tbody.innerHTML = ''
             }
 
             /** 
              * file.value will be recieved as C:\\....
              * So to recieve file name, we need to split it by '\\', and it will be ["C:", ..., "file.name"] 
             */
 
             // To print file name, we need to take the last element of array
             emptyMessage.innerHTML = `Datei <span>${arrFromFileName[arrFromFileName.length - 1]}</span> ist leer`
          }
 
          // If file is not empty:
          else {
             // Cleaning emptyMessage field if it was printed before
             if (emptyMessage.value != 0)
                emptyMessage.innerHTML = ''
 
             /**
              * @param data - Data array with Array of Objects 
              * @param initialArray - Array with only two columns 
              */
             const data = csvToArray(text)[0]
 
             const initialArray = getFilters(data)[0]
             console.log(initialArray)
 
             if (initialArray.length === 0) {
                emptyMessage.innerHTML = "Bitte fügen Sie Filter hinzu"
 
                document.body.append(emptyMessage)
             }
 
             // Cleaning table if it was printed before
             dataTable.innerHTML = ''
             table.innerHTML = ''
             thead.innerHTML = ''
             tbody.innerHTML = ''
 
             const innerTable = document.createElement('table')
             innerTable.innerHTML = ''
 
             // Adding thead and tbody to the table
             table.appendChild(thead)
             table.appendChild(tbody)
             table.setAttribute("id", "tb")
 
             // Adding table to our parent table declared in HTML file
             document.getElementById('data-table').appendChild(table)
 
             if (initialArray.length < +rowLimiter.value)
                rowLimiter.value = `${initialArray.length}`
 
             /**
              * @param hrow - Header row
              * 
              * First row in InitialArray are headers names as it's written in csvToArray() function when adding headers
              * So we create a loop with 2 iterations as we have only 2 columns, and take first row as headers names
              */
             let hrow = document.createElement('tr')
             for (let i = 0; i < initialArray[0].length; i++) {
                let theader = document.createElement('th')
 
                // Writing header name into theader slot
                theader.innerHTML = initialArray[0][i]
                // Appending theader slot to header row
                hrow.appendChild(theader)
             }
             // Appending header row into Header section
             thead.appendChild(hrow)
 
             /**
              * @param {Number} rowLimiter - rowLimiter from HTML input with type="number". 
              *                              Unary plus converts recieved string into a number
              * @param table_data - table data slot
              * @param table_data_button - a button inserting into a table slot
              * @param body_row - row for table body (tbody)
              * @param tbody - table body
              * 
              * Iterations going from 1 to rowLimiter. From 1, because index 0 in initialArray is headers array, and we need only data
              */
 
             for (let key of Object.keys(initialArray[0]))
                console.log(initialArray[0].key)
 
             for (let i = 1; i < +rowLimiter.value; i++) {
                let body_row = document.createElement('tr')
 
                for (let key of Object.keys(initialArray[i])) {
                   let table_data = document.createElement('td')
 
                   table_data.setAttribute('id', `cell ${i}`)
 
                   if (key in getFilters(data)[1])
                      table_data.innerHTML = initialArray[i].key
 
                   body_row.appendChild(table_data)
                }
                tbody.appendChild(body_row)
             }
 
             table.appendChild(thead)
             table.appendChild(tbody)
             dataTable.appendChild(table)
 
             const cell = document.getElementById("cell")
 
             tb.addEventListener("click", e => {
 
                const id = document.getElementById(e.target.id)
                console.log(id)
 
                table.innerHTML = ''
                thead.innerHTML = ''
                tbody.innerHTML = ''
 
                const targetObj = data.find(object => object.tLogIn === id.innerHTML || object.tLogOut === id.innerHTML || object.tLastAcc === id.innerHTML)
                const headers = csvToArray(text)[1]
 
                const hrow = document.createElement('tr')
                const drow = document.createElement('tr')
                
                for (let i = 0; i < headers.length; i++) {
                   const helem = document.createElement('th')
                   
                   helem.innerHTML = headers[i]
                   hrow.appendChild(helem)
                }
 
                for (let value of Object.values(targetObj)) {
                   const delem = document.createElement('td')
                   
                   delem.innerHTML = value
                   drow.appendChild(delem)
                }
 
                thead.appendChild(hrow)
                tbody.appendChild(drow)
 
                innerTable.appendChild(thead)
                innerTable.appendChild(tbody)
                dataTable.appendChild(innerTable)
             })
          }
       }
       // Using to read input file
       reader.readAsText(input)
    }
 })