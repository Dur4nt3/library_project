function Book(title, author, genre, length, readStatus, inLibrary, itemID) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.length = length;
    this.readStatus = readStatus;
    this.inLibrary = inLibrary;
    this.itemID = itemID;
}

function createBook(title, author, genre, length, readStatus, inLibrary) {
    let obj = new Book(title, author, genre, length, readStatus, inLibrary, itemCount);
    itemCount++;
    myLibrary.push(obj);
}

// Retrieve book object based on ID to perform actions on the book
function locateBook(id) {
    return myLibrary.find(obj => obj.itemID == id);
}

// Create a single line (<li></li>) of detail about the book
function buildItem(property, value, parentElement) {
    let li = document.createElement("li");
    let headSpan = document.createElement("span");
    let infoSpan = document.createElement("span");
    let head = property.charAt(0).toUpperCase() + property.slice(1) + ": ";
    if (property == "readStatus"){
        head = "Read Status: ";
    }

    headSpan.classList.add("item-header");
    headSpan.textContent = head;

    if (property == "length"){
        infoSpan.textContent = value + " Pages";
    }
    else if (property == "readStatus") {
        if (value == false) {
            infoSpan.textContent = "Didn't Read";
        }
        else {
            infoSpan.textContent = "Already Read";
        }
    }
    else {
        infoSpan.textContent = value;
    }

    li.appendChild(headSpan);
    li.appendChild(infoSpan);
    parentElement.appendChild(li);
}

// Constructs all the details about the book
function buildList(obj, parentElement) {
    let bookDetails = document.createElement("ul");
    bookDetails.classList.add("book-details");
    parentElement.appendChild(bookDetails);

    for (key in obj) {
        if(key != "inLibrary" && key != "itemID") {
            buildItem(key, obj[key], bookDetails);
        }
    }
}

// Builds the action buttons in a card
function buildButtons(obj, parentElement) {
    let buttonCont = document.createElement("div");
    buttonCont.classList.add("action-buttons");

    let markRead = document.createElement("button");
    markRead.classList.add("action-button", "mark-read");
    markRead.textContent = "Mark Read";

    let markNotRead = document.createElement("button");
    markNotRead.classList.add("action-button", "mark-not-read");
    markNotRead.textContent = "Mark Not Read";

    let removeBook = document.createElement("button");
    removeBook.classList.add("action-button", "remove-book");
    removeBook.textContent = "Remove Book";

    if (obj.readStatus) {
        markRead.classList.add("hide");
    }
    else {
        markNotRead.classList.add("hide");
    }

    buttonCont.appendChild(markRead);
    buttonCont.appendChild(markNotRead);
    buttonCont.appendChild(removeBook);
    parentElement.appendChild(buttonCont);
}


// Fully construct a book's card
function createElement(obj) {
    let bookCont = document.createElement("div");
    bookCont.classList.add("book");
    if (!obj.readStatus) {
        bookCont.classList.add("not-read-book");
    }
    else {
        bookCont.classList.add("read-book");
    }
    bookCont.id = obj.itemID;
    libraryCont.appendChild(bookCont);
    buildList(obj, bookCont);
    buildButtons(obj, bookCont);
}

// Displays initial books in "myLibrary" + consequent added ones
function initialDisplay() {
    for (index in myLibrary) {
        let obj = myLibrary[index];
        if (!obj.inLibrary){
            createElement(obj);
        }
        obj.inLibrary = true;
    }
}

// Perform actions based on buttons pressed on each book
function cardButtonPress(action, element) {
    let cardCont = element.parentElement.parentElement;
    let bookID = cardCont.id;
    let bookObj = locateBook(bookID);
    let buttonCont = element.parentElement;
    let readItem = cardCont.querySelector(".book-details").lastChild.lastChild;

    if (action == "mark-read") {
        buttonCont.querySelector(".mark-read").classList.add("hide");
        buttonCont.querySelector(".mark-not-read").classList.remove("hide");
        cardCont.classList.remove("not-read-book");
        cardCont.classList.add("read-book");
        bookObj.readStatus = true;
        readItem.textContent = "Already Read";
    }
    else if (action == "mark-not-read") {
        buttonCont.querySelector(".mark-not-read").classList.add("hide");
        buttonCont.querySelector(".mark-read").classList.remove("hide");
        cardCont.classList.remove("read-book");
        cardCont.classList.add("not-read-book");
        bookObj.readStatus = false;
        readItem.textContent = "Didn't Read";
    }
    else if (action == "remove-book") {
        myLibrary.splice(bookObj, 1);
        cardCont.remove();
    }
}

function errorHandler(action) {

    switch (action){
        case "length-required":
            formCont.querySelector(".too-long").classList.add("hide");
            formCont.querySelector(".length-error").classList.add("hide");
            formCont.querySelector("#length").classList.remove("input-error");
            break;
        
        case "too-long":
            formCont.querySelector(".length-error").classList.add("hide");
            formCont.querySelector(".too-long").classList.remove("hide");
            formCont.querySelector("#length").classList.add("input-error");
            break;

        case "length-valid": 
            formCont.querySelector(".too-long").classList.add("hide");
            formCont.querySelector(".length-error").classList.add("hide");
            formCont.querySelector("#length").classList.remove("input-error");
            formCont.querySelector("#length").classList.remove("input-required");
            break;

        case "length-invalid":
            formCont.querySelector(".too-long").classList.add("hide");
            formCont.querySelector(".length-error").classList.remove("hide");
            formCont.querySelector("#length").classList.add("input-error");
            break;

        case "valid-form":
            formCont.querySelector(".required-error").classList.add("hide");
            formCont.querySelector(".valid-form").classList.remove("hide");
            setTimeout(() => { formCont.querySelector(".valid-form").classList.add("hide"); }, 1000);
            break;
    }
}

// Validate form input
function validateInput() {
    let valid = 0;
    let errorSpan = formCont.querySelector(".required-error");
    // Initialize the error message to ensure no duplicates
    errorSpan.textContent = "Please enter the following: ";
    let inputArray = [formCont.querySelector("#title"), 
    formCont.querySelector("#author"), formCont.querySelector("#genre"), formCont.querySelector("#length")];

    for (index in inputArray) {
        if (inputArray[index].value == "") {
            if (index == (inputArray.length - 1)) {
                errorSpan.classList.remove("hide");
                errorSpan.textContent += inputArray[index].id + ".";
                errorHandler("length-required");
            }
            else {
                errorSpan.classList.remove("hide");
                errorSpan.textContent += inputArray[index].id + ", ";
            }

            inputArray[index].classList.add("input-required");
        }
        // Validating the book's length - adding/removing error classes as needed
        else if (index == 3) {
            let bookLength = Number(inputArray[index].value);
            if(Number.isInteger(bookLength) && bookLength > 0) {
                if (bookLength > 21450) {
                    errorHandler("too-long");
                    continue;
                }
                else {
                    errorHandler("length-valid");
                    valid++;
                    continue;
                }
            }
            else {
                errorHandler("length-invalid");
                continue;
            }
        }

        else {
            inputArray[index].classList.remove("input-required");
            valid++;
        }
    }

    if (valid == 4) {
        createBook(inputArray[0].value, inputArray[1].value, inputArray[2].value, Number(inputArray[3].value), formCont.querySelector("#read-status").checked, false);
        errorHandler("valid-form");
        formCont.reset();
        initialDisplay();
    }

    // Ensure error is displaying grammatically correct
    if (errorSpan.textContent.slice(-1) == " ") {
        errorSpan.textContent = errorSpan.textContent.slice(0, -2) + ".";
    }

}

const myLibrary = [];
let libraryCont = document.querySelector(".book-collection");
let formCont = document.querySelector(".modal-form");

// Prevent overriding removed book's ID by creating a global ID variable
let itemCount = 0;

createBook("The Divine Comedy", "Dante Alighieri", "Narrative Poem", 928, false, false);
createBook("Frankenstein", "Mary W. Shelley", "Gothic Novel", 192, false, false);
createBook("Slaughterhouse-Five", "Kurt Vonnegut", "Dark Comedy", 288, false, false);

initialDisplay();

libraryCont.addEventListener("click", (e) => { 
    if (e.target.classList[0] == "action-button") {
        cardButtonPress(e.target.classList[1], e.target);
    }
});

document.querySelector(".add-book").addEventListener("click", () => { 
    document.querySelector(".modal-wrapper").classList.remove("hide");
});

formCont.addEventListener("click", (e) => {
    if (e.target.classList[0] == "close-icon") {
        document.querySelector(".modal-wrapper").classList.add("hide");
    }

    if (e.target.classList[0] == "form-button") {
        e.preventDefault();
        validateInput();
    }
});