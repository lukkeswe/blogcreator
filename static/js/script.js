let sessionArray = [];
let styleArray = [];
let style = {
    titleColour:"black",
    textColour:"black",
    backgroundColor:"white",
    titleWeight:"bold",
    textWeight:"normal"
};
let sessionCounts = {
    txt: 0,
    flexlist: 0,
    article: 0
};
let itemType = {
    txt : "txt",
    flexlist : "fxl",
    article : "art"
};
let storedArray = sessionStorage.getItem('blogStructure');
let storedStyle = sessionStorage.getItem('styleArray');
let cartman = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2QxMW5rMXE3dXBrZHZmbjF0N2RpcTlvNHBkcHF2NDlzZ2p3aDY3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XiGdBtlp1zLoEqO24z/giphy.webp";

if (storedStyle) {
    // Convert the stored string back into an array of objects
    storedStyle = JSON.parse(storedStyle);
    styleArray = storedStyle;
    console.log(storedStyle);
    for (let i = 0; i < storedStyle.length; i++) {
        let element = storedStyle[i];
        let type = element.id.slice(0, 3);
        let number = element.id.slice(3);
        console.log("Element type: " + type);
        
        if (type == itemType.txt) {
            sessionCounts.txt = number - 1;
            console.log("Making text element");
            addTextElement();
        }
        else if (type == itemType.flexlist){
            sessionCounts.flexlist = number - 1;
            console.log("Making flexlist element");
            
            addFlexListElement();
        }
        else if (type == itemType.article){
            sessionCounts.article = number - 1;
            console.log("Making article element");
            
            addArticleElement();
        }
        // Get the loaded element's parts
        const mainElement = document.getElementById('self_' + element.id);
        const title = document.getElementById('title_' + element.id);
        const text = document.getElementById('text_' + element.id);
        // Style the elements
        mainElement.style.backgroundColor = element.style.backgroundColor;
        title.textContent = element.title;
        title.style.fontWeight = element.style.titleWeight;
        title.style.color = element.style.titleColour;
        text.textContent = element.text;
        text.style.fontWeight = element.style.textWeight;
        text.style.color = element.style.textColour;
        // If it is an article element get the saved src
        if (type == itemType.article) {
            const image = document.getElementById('image_' + element.id);
            image.src = element.src;

        } else if (type == itemType.flexlist) {
            // If it is a flexlist element get all the articles
            // const articles = element.article + '_' + element.id;
            for (let j = 0; j < element.article.length; j++) {
                let articleId = element.article[j].id;
                console.log("article id: " + articleId);
                
                const mainArticle = document.getElementById('article_' + articleId);
                const title = document.getElementById('title_' + articleId);
                const text = document.getElementById('text_' + articleId);
                const image = document.getElementById('image_' + articleId);
                // Style the articles
                mainArticle.style.backgroundColor = element.article[j].style.backgroundColor;
                title.textContent = element.article[j].title;
                title.style.fontWeight = element.article[j].style.titleWeight;
                title.style.color = element.article[j].style.titleColour;
                text.textContent = element.article[j].text;
                text.style.fontWeight = element.article[j].style.textWeight;
                text.style.color = element.article[j].style.textColour;
                image.src = element.article[j].src;
            }
        }
    }
} else {
    console.log('No array found in sessionStorage');
}

function createTextArticleElement(){
    let elementId = addTextElement();
    appendToSessionArray(elementId);

    let saveObject = createSaveObject("text", elementId, "Title here", "Insert text here. ", style);
    styleArray.push(saveObject);
    console.log("styleArray:" + JSON.stringify(styleArray));
    let save = JSON.stringify(styleArray);
    sessionStorage.setItem('styleArray', save);
}

//Create a save object for a text element
function createSaveObject(type, id, title, text, style, src, article){
    let saveObject = {};
    saveObject = 
        {
            id:id,
            title:title,
            text:text,
            style:{
                titleColour:style.titleColour,
                textColour:style.textColour,
                backgroundColor:style.backgroundColor,
                titleWeight:style.titleWeight,
                textWeight:style.textWeight
            }
        };
    if (type === "article") {
        saveObject.src = src;
    } else if (type === "flexlist") {
        saveObject.article = article;
    }

    return saveObject;
}

function addTextElement() {
    sessionCounts.txt++;
    const elementId = (itemType.txt + sessionCounts.txt);
    // appendToSessionArray(elementId);
    
    const container = document.getElementById('container');

    const newDiv = createContainer('textElement', ('self_' + elementId));

    const newContainer = createContainer('elementContainer');

    const newTitle = createTitleElement('Title here', ('title_' + elementId));
    const newTitleTextArea = createTextAreaContainer(('title_' + elementId), ('textArea_' + elementId), 'title', elementId);

    const newText = createTextElement('Insert text here. ', ('text_' + elementId));
    const newTextArea = createTextAreaContainer(('text_' + elementId), ('textArea_' + elementId), 'text', elementId);

    const newEditButton = createEditButtonElement(elementId);
    const newUl = createUlElement('editUl', elementId);


    const newLiColour = createOptionButton(elementId, 'textColour', 'text', 'Text colour');
    newUl.appendChild(newLiColour);
    // Create an option to change the background
    const newLiBackgrond = createOptionButton(elementId, 'background', 'self', 'Background colour');
    newUl.appendChild(newLiBackgrond);
    // Create an option to change the colour of the title
    const newLiTitleColour = createOptionButton(elementId, 'titleColour', 'title', 'Title');
    newUl.appendChild(newLiTitleColour);
    // Create an option to change the title's font weight
    const newLiTitleFontWeight = createOptionButton(elementId, 'weight', 'title', 'Title weight');
    newUl.appendChild(newLiTitleFontWeight);
    // Create an optin to change the text of an element
    const newLiTextEdit = createOptionButton(elementId, 'text', 'text', 'Text');
    newUl.appendChild(newLiTextEdit);
    // Create an option to remove main element (container)
    const newLiRemove = createOptionButton(elementId, 'remove', 'self', 'Remove');
    newUl.appendChild(newLiRemove);
    
    newContainer.appendChild(newText);
    newContainer.appendChild(newTextArea);
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newTitleTextArea);
    newDiv.appendChild(newContainer);
    newDiv.appendChild(newEditButton);
    newDiv.appendChild(newUl);

    container.insertBefore(newDiv, container.lastChild);

    return elementId;
}

function createFlexListElement(){
    let values = addFlexListElement();
    appendToSessionArray(values.elementId);

    let saveObject = createSaveObject("flexlist", values.elementId, 'Title here', '', style, cartman, values.articles);
    styleArray.push(saveObject);
    console.log("styleArray:" + JSON.stringify(styleArray));
    let save = JSON.stringify(styleArray);
    sessionStorage.setItem('styleArray', save);
}

function addFlexListElement(){
    sessionCounts.flexlist++;
    const elementId = (itemType.flexlist + sessionCounts.flexlist);
    //appendToSessionArray(elementId);

    const container = document.getElementById('container');

    // Create a new div with the 'flexList' class and an id
    const newDiv = createContainer('flexList', ('self_' + elementId));
    // Create a title element
    const newTitle = createTitleElement('Title here', ('title_' + elementId));
    const newTitleTextArea = createTextAreaContainer(('title_' + elementId), ('textArea_' + elementId), 'title', elementId);
    // Create a text element
    const newText = createTextElement('', ('text_' + elementId));
    const newTextArea = createTextAreaContainer(('text_' + elementId), ('textArea_' + elementId), 'text', elementId);
    // Create a container for the articles
    const newContainer = createContainer('elementContainer', ('elementContainer_' + elementId));

    let articles = [];
    // Create and append list articles (3 in this case)
    for (let i = 1; i <= 3; i++) {
        // Create an article id
        const articleId = i + '_' + elementId;
        // Create the elements of the article
        const listArticle = createContainer('listArticle', ('article_' + articleId));
        const newTitle = createTitleElement('', ('title_' + articleId));
        const newTitleTextArea = createTextAreaContainer(('title_' + articleId), ('textArea_' + articleId), 'title', articleId);
        const newImage = createImageElement(cartman, 'Article Image', ('image_' + articleId));
        const newText = createTextElement('Insert text here.', ('text_' + articleId));
        const newTextArea = createTextAreaContainer(('text_' + articleId), ('textArea_' + articleId), 'text', articleId);
        // Append the elements into the correct parent elements
        listArticle.appendChild(newTitle);
        listArticle.appendChild(newTitleTextArea);
        listArticle.appendChild(newImage);
        listArticle.appendChild(newText);
        listArticle.appendChild(newTextArea);
        newContainer.appendChild(listArticle);
        // Create an edit button an ul forr the edit options
        const newEditButton = createEditButtonElement(articleId);
        const newUl = createUlElement('editUl', articleId);
        // Create the options
        const newLiBackgrond = createOptionButton(articleId, 'background', 'article', 'Background colour');
        const newLiTextColour = createOptionButton(articleId, 'textColour', 'text', 'Text colour');
        const newLiTextEdit = createOptionButton(articleId, 'text', 'text', 'Edit text');
        // Create an option to upload a new picture
        const newLiUpload = createOptionButton(articleId, 'upload', 'input', 'Image');
        // Create remove option for the article
        const newLiRemove = createOptionButton(articleId, 'remove', 'article', 'Remove');
        // Append the options into the list
        newUl.appendChild(newLiBackgrond);
        newUl.appendChild(newLiTextColour);
        newUl.appendChild(newLiTextEdit);
        newUl.appendChild(newLiUpload);
        newUl.appendChild(newLiRemove);
        // Append the edit button and list into the article
        listArticle.appendChild(newEditButton);
        listArticle.appendChild(newUl);

        let article = {
            id:articleId,
            title:"",
            text:"Insert text here.",
            style:{
                titleColour:style.titleColour,
                textColour:style.textColour,
                backgroundColor:style.backgroundColor,
                titleWeight:style.titleWeight,
                textWeight:style.textWeight
            },
            src:cartman
        };
        articles.push(article);
    }
    // Create a edit button for the main container
    const newEditButton = createEditButtonElement(elementId);
    const newUl = createUlElement('editUl', elementId);
    // Create edit options
    const newLiBackgrond = createOptionButton(elementId, 'background', 'self', 'Background colour');
    const newLiTextEdit = createOptionButton(elementId, 'text', 'text', 'Edit text');
    const newLiRemove = createOptionButton(elementId, 'remove', 'self', 'Remove');
    // Append the options to the ul
    newUl.appendChild(newLiBackgrond);
    newUl.appendChild(newLiTextEdit);
    newUl.appendChild(newLiRemove);
    // Append all teh new elements to the main element (div)
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newTitleTextArea);
    newDiv.appendChild(newContainer);
    newDiv.appendChild(newText);
    newDiv.appendChild(newTextArea);
    newDiv.appendChild(newEditButton);
    newDiv.appendChild(newUl);

    // Insert the new flexList div before the first element in the container
    container.insertBefore(newDiv, container.lastChild);

    let values = {"elementId":elementId, 'articles':articles};

    return values;
}

function createArticleElement(){
    let elementId = addArticleElement();
    appendToSessionArray(elementId);

    let saveObject = createSaveObject('article', elementId, 'Title here', 'Add text here.', style, cartman);
    styleArray.push(saveObject);
    console.log("styleArray:" + JSON.stringify(styleArray));
    let save = JSON.stringify(styleArray);
    sessionStorage.setItem('styleArray', save);
}

function addArticleElement(){
    sessionCounts.article++;
    const elementId = itemType.article + sessionCounts.article;
    //appendToSessionArray(elementId);

    // Get the container where the new elements should be inserted
    const container = document.getElementById('container');

    // Create a new div element to hold the new content
    const newDiv = createContainer('article', ('self_' + elementId));

    const newContainer = createContainer('elementContainer', ('textElement_' + elementId));
    // Create title element with hidden text-area container
    const newTitle = createTitleElement('Title here', ('title_' + elementId));
    const newTitleTextArea = createTextAreaContainer(('title_' + elementId), ('textArea_' + elementId), 'title', elementId);
    // Create text element with hidden text-area container
    const newText = createTextElement('Add text here.', ('text_' + elementId));
    const newTextArea = createTextAreaContainer(('text_' + elementId), ('textArea_' + elementId), 'text', elementId);
    // Create image element
    const newImage = createImageElement(cartman, 'Placeholder image', ('image_' + elementId));
    // Create an edit button
    const newEditButton = createEditButtonElement(elementId);
    const newUl = createUlElement('editUl', elementId);
    // Create the option buttons
    const newLiColour = createOptionButton(elementId, 'textColour', 'text', 'Text colour');
    const newLiTitleColour = createOptionButton(elementId, 'titleColour', 'title', 'Title colour');
    const newLiBackgrond = createOptionButton(elementId, 'background', 'self', 'Background colour');
    const newLiTitleFontWeight = createOptionButton(elementId, 'weight', 'title', 'Title weight');
    const newLiTextFontWeight = createOptionButton(elementId, 'weight', 'text', 'Text weight');
    const newLiTextEdit = createOptionButton(elementId, 'text', 'text', 'Edit text');
    // Create an option to upload a new picture
    const newLiUpload = createOptionButton(elementId, 'upload', 'input', 'Image');
    //Create an remove option to remove the main element
    const newLiRemove = createOptionButton(elementId, 'remove', 'self', 'Remove');
    // Append the option buttons to the ul
    newUl.appendChild(newLiColour);
    newUl.appendChild(newLiTitleColour);
    newUl.appendChild(newLiBackgrond);
    newUl.appendChild(newLiTitleFontWeight);
    newUl.appendChild(newLiTextFontWeight);
    newUl.appendChild(newLiTextEdit);
    newUl.appendChild(newLiUpload);
    newUl.appendChild(newLiRemove);
    // Append the text and image to the new div
    newContainer.appendChild(newText);
    newContainer.appendChild(newTextArea);
    newContainer.appendChild(newImage);
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newTitleTextArea);
    newDiv.appendChild(newContainer);
    newDiv.appendChild(newEditButton);
    newDiv.appendChild(newUl);
    // Insert the new element before the button (or above, in terms of layout)
    container.insertBefore(newDiv, container.lastChild);

    return elementId;
}
// Helper function to create a div with a specific class name
function createDivWithClass(className) {
    const div = document.createElement('div');
    div.className = className;
    return div;
}
// Helper function to create a container (div) with a specific class name
function createContainer(className, id){
    const div = document.createElement('div');
    div.className = className;
    div.id = id;
    return div;
}
// Helper function to create an image element with a source and alt text
function createImageElement(src, alt, id) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.id = id;
    return img;
}
// Helper function to create a text element with a specific text content
function createTextElement(text, id) {
    const p = document.createElement('p');
    p.textContent = text;
    p.id = id;
    return p;
}
// Helper function to create a title element with a specific text content
function createTitleElement(text, id) {
    const h2 = document.createElement('h2');
    h2.textContent = text;
    h2.id = id;
    return h2;
}
// Helper function to create a button to show a list of edit options
function createEditButtonElement(id) {
    const button = document.createElement('button');
    button.id = 'edit_' + id;
    button.className = 'editButton';
    button.textContent = '+';
    // Set an onclick event that display the edit options
    button.onclick = function() {
        const ulElement = document.getElementById('ul_' + id);
        if (ulElement.style.display === "block") {
            ulElement.style.display = 'none';
        } else {
            ulElement.style.display = 'block';
        }
    };
    
    return button;
}
// Helper function to create a input field
function createInputField(id){
    const input = document.createElement('input');
    input.id = id;
    input.type = "text";
    input.name = "text";
    input.className = "inputField";
    input.placeholder = "Add text here"
    
    return input;
}
// Helper function to create a submit button
function createSubmitButton(elementId, inputId){
    const button = document.createElement('button');
    button.textContent = "Submit";
    button.onclick = function() {
        const element = document.getElementById(elementId);
        const input = document.getElementById(inputId);
        element.textContent = input.value;
    };

    return button;
}
// Helper function to create a button element with class name and id
function createButtonElement(className, id){
    const button = document.createElement('button');
    button.className = className;
    button.id = id;
    return button;
}
// Helper function to create a button that displays a specific element by targeting it's id
function createShowButtonElement(className, id, elementId, text){
    const button = document.createElement('button');
    button.className = className;
    button.id = id;
    button.textContent = text;
    button.onclick = function() {
        const element = document.getElementById(elementId);
        if (element.style.display === "flex") {
            element.style.display = "none";
        } else {
            element.style.display = "flex";
        } 
    };
    return button;
}
// Helper function to create a text area element complete with a submit button and container
function createTextAreaContainer(elementId, id, type, styleId) {   
    const container = createContainer('textAreaContainer', ('container_'+ type + '_' + id));
    container.style.display = 'none';
    const textArea = document.createElement('textarea');
    textArea.id = (type + '_' + id);
    const button = createButtonElement('textAreaButton');
    button.textContent = "Add text";
    button.onclick = function() {
        const textElement = document.getElementById(elementId);
        textElement.textContent = textArea.value;
        toggleShowTextArea(elementId, container.id);
        updateStyle(styleId, (type + 'Content'), textArea.value);
    };

    container.appendChild(textArea);
    container.appendChild(button);

    return container;
}
// Helper function to create an unorderd list element with class name and id
function createUlElement(className, id) {
    const ul = document.createElement('ul');
    ul.className = className;
    ul.id = 'ul_' + id;
    return ul;
}
// Helper function to create a list element with class name, text and id
function createLiElement(className, text, id) {
    const li = document.createElement('li');
    li.className = className;
    li.textContent = text;
    li.id = id;
    return li;
}
// Helper function to create a font colour element (button)
function createColourElement(colour, id, elementId, option) {
    const button = document.createElement('button');
    button.className = colour + 'Palette palette';
    button.style.backgroundColor = colour;
    // Set an onclick event that changes the text colour of a targeted element
    button.onclick = function() {
        const element = document.getElementById(id);
        element.style.color  = colour;
        updateStyle(elementId, option, colour);
    };

    return button;
}
//Helper function to create a colour palette
function createColourPaletteElement(id, colourId, option, elementId){
    const container = createContainer('colourPalette option', id);
    // Colours used in for the colour palette
    const colours = [
        ['white', 'black', 'green', 'red', 'blue', 'blanchedalmond'],
        ['antiquewhite', 'lightcoral', 'lightsalmon', 'lightskyblue', 'lightseagreen', 'darkviolet'],
        ['yellow', 'pink', 'purple', 'orange', 'brown', 'hotpink']
    ];
    // Decide which element creation function to use based on option
    const createElement = (option === 'background') ? createBackgroundColourElement : createColourElement;
    // Iterate over 2D array to create rows and colour elements
    for (let i = 0; i < colours.length; i++) {
        const row = createContainer('colourRow');
        for (let j = 0; j  < colours[i].length; j++) {
            let colour = createElement(colours[i][j], colourId, elementId, option);
            row.appendChild(colour);
        }
        container.appendChild(row);
    }
    // Return the colour palette (container)
    return container;
}
// Helper function to create a background colour element (button)
function createBackgroundColourElement(colour, elementId, id, option) {
    const button = document.createElement('button');
    button.className = colour + 'Palette palette';
    button.style.backgroundColor = colour;
    // Set an onclick event that changes the text colour of a targeted element
    button.onclick = function() {
        const element = document.getElementById(elementId);
        element.style.backgroundColor  = colour;
        updateStyle(id, option, colour);
    };

    return button;
}
// Function to update 'styleArray[]'
function updateStyle(id, option, value){
    console.log('update id: ' + id);
    
    for (let i = 0; i < styleArray.length; i++) {
        let splitId = id.slice(2, 6);
        let flexlist = id.slice(2, 5);
        if (flexlist == "fxl") {
            if(styleArray[i].id == splitId){
                let articles = styleArray[i].article;
                for (let j = 0; j < articles.length; j++) {
                    if(styleArray[i].article[j].id == id){
                        if (option == "background") {
                            styleArray[i].article[j].style.backgroundColor = value;
                        } else if (option == "titleColour") {
                            styleArray[i].article[j].style.titleColour = value;
                        } else if (option == "textColour") {
                            styleArray[i].article[j].style.textColour = value;
                        } else if(option == "titleContent") {
                            styleArray[i].article[j].title = value;
                        } else if (option == "textContent") {
                            styleArray[i].article[j].text = value;
                        } else if(option == "titleWeight") {
                            styleArray[i].article[j].style.titleWeight = value;
                        } else if(option == "textWeight") {
                            styleArray[i].article[j].style.textWeight = value;
                        } else if(option == "src") {
                            styleArray[i].article[j].src = value;
                        }
                    }
                }
            }
        } else {
            if(styleArray[i].id == id){
                if (option == "background") {
                    styleArray[i].style.backgroundColor = value;
                } else if (option == "titleColour") {
                    styleArray[i].style.titleColour = value;
                } else if (option == "textColour") {
                    styleArray[i].style.textColour = value;
                } else if(option == "titleContent") {
                    styleArray[i].title = value;
                } else if (option == "textContent") {
                    styleArray[i].text = value;
                } else if(option == "titleWeight") {
                    styleArray[i].style.titleWeight = value;
                } else if(option == "textWeight") {
                    styleArray[i].style.textWeight = value;
                } else if(option == "src") {
                    styleArray[i].src = value;
                }
            }
        }
    }
    console.log(styleArray);
    let save = JSON.stringify(styleArray);
    sessionStorage.setItem('styleArray', save);
}
// Helper function to create a font weight element (button)
function createBoldFontElement(size, id, text) {
    const button = document.createElement('button');
    button.className = size + 'Weight weight';
    button.textContent = text;
    button.onclick = function() {
        const element = document.getElementById(id);
        element.style.fontWeight = size;
    };

    return button;
}
// Helper function to create an option button element
function createOptionButton(elementId, option, type, text){
    let optionId = option + '_' + type + '_' + elementId;
    let typeId = type + '_' + elementId;

    const newLi = createLiElement('editLi', '', (option + '_edit_' + elementId));
    const newDisplayButton = createShowButtonElement('showButton', ('show_' + elementId), optionId, text);
    newLi.appendChild(newDisplayButton);
    
    // Declare variables outside the conditional blocks
    let newColourPalette;
    let newBoldFontButton, newNormalFontButton, newOptionBox, newInputBox;
    let showTextAreaButton, showTitleTextAreaButton;
    let uploadElement, uploadButton, newUploadBox;
    let newRemoveBox, removeButton;

    if (option == "background" || option == "titleColour" || option == "textColour") {
        newColourPalette = createColourPaletteElement(optionId, typeId, option, elementId, );
        newLi.appendChild(newColourPalette);
        
    } 
    else if (option == "weight") {
        newNormalFontButton = createBoldFontElement('normal', typeId, 'Normal');
        newBoldFontButton = createBoldFontElement('bold', typeId, 'Bold');
        
    } else if (option == "text") {
        showTextAreaButton = document.createElement('button');
        showTextAreaButton.textContent = "Text";
        showTextAreaButton.onclick = function() {
            toggleShowTextArea(('text_' + elementId), ('container_'+ type + '_textArea_' + elementId));
        };
        showTitleTextAreaButton = document.createElement('button');
        showTitleTextAreaButton.textContent = "Title";
        showTitleTextAreaButton.onclick = function() {
            toggleShowTextArea(('title_' + elementId), ('container_title_textArea_' + elementId));
        };
    } else if (option == 'upload'){
        // Create a container for the upload related elements
        newUploadBox = createContainer('uploadBox option', optionId);
        // Create elements for the image upload handeling
        uploadElement = createImageUploadElement(typeId, ('span_' + typeId));
        uploadElement.style.display = 'none';
        uploadButton = createImageUploadbuttonElement(typeId, ('inputButton_' + elementId), ('image_' + elementId), elementId);
        // Create a label for the file (image) input element
        const newLabel = document.createElement('label');
        newLabel.id = ('label_' + typeId);
        newLabel.className = 'uploadLabel';
        newLabel.htmlFor = typeId;
        newLabel.textContent = 'Choose a file';
        // Create a span element that will act like a placeholder for the targeted image file name
        const newSpan = document.createElement('span');
        newSpan.id = ('span_' + typeId);
        newSpan.className = 'uploadSpan';
        newSpan.textContent = 'no file chosen';
        // Append all the new ellements to the upload container
        newUploadBox.appendChild(newLabel);
        newUploadBox.appendChild(uploadElement);
        newUploadBox.appendChild(newSpan);
        newUploadBox.appendChild(uploadButton);
        // Append the upload container to the list element
        newLi.appendChild(newUploadBox);
    } else if (option == 'remove') {
        newRemoveBox = createContainer('removeBox option', optionId);
        newRemoveBox.style.display = 'none';
        removeButton = createButtonElement('removeButton');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function(){
            let element = document.getElementById(typeId);
            if (element) {
                element.remove();
                removeItemFromSession(elementId);
                console.log('Removed: ' + typeId + ' successfully.');
                
            } else {
                console.log('No element found by the name: ' + typeId);
            }
        };
        newRemoveBox.appendChild(removeButton);
        newLi.appendChild(newRemoveBox);
    }
    if (option == "weight"){
        // Create a container for the hidden option elements
        newOptionBox = createContainer('optionBox option', optionId);
        // Append the option elemants to the newly created container
        newOptionBox.appendChild(newNormalFontButton);
        newOptionBox.appendChild(newBoldFontButton);
        // Append the container into the list item
        newLi.appendChild(newOptionBox);
    } else if(option == "text") {
        // Create a container for the hidden input elements
        newInputBox = createContainer('inputBox option', optionId);
        // Append the container into the list item
        newInputBox.appendChild(showTitleTextAreaButton);
        newInputBox.appendChild(showTextAreaButton);
        newLi.appendChild(newInputBox);
    }

    return newLi;
}
// Helper function to create a upload option for images
function createImageUploadElement(id, elementId) {
    const input = document.createElement('input');
    input.id = id;
    //input.className = 'uploadElement';
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function() {
        showFileName(id, elementId);
    };

    return input;
}
// Helper function to make an image input button
function createImageUploadbuttonElement(inputId, id, imageId, elementId){
    const button = createButtonElement('uploadButton', id);
    button.textContent = 'Upload';
    
    button.onclick = async function() {
        let src = await imageUpload(inputId); // Wait for the image upload to finish
        if (src) {
            changePicture(src, imageId); // Only update the image if the upload succeded
            updateStyle(elementId, 'src', src);
        } else {
            console.error("Image upload failed. No image to update.");
        }
        
    };

    return button;
}
// Toggle show/hide text area element (show/hide text element)
function toggleShowTextArea(elementId, textAreaId) {
    console.log('trying : ' + elementId + ' and ' + textAreaId);
    const textElement = document.getElementById(elementId);
    const textArea = document.getElementById(textAreaId);

    if (textArea.style.display == 'none') {
        textArea.style.display = 'block';
        textElement.style.display = 'none';
    } else {
        textArea.style.display = 'none';
        textElement.style.display = 'block';
    }
}
// Apppend new data to the session array
function appendToSessionArray(data){
    sessionArray.push(data);
    sessionStorage.setItem('blogStructure', JSON.stringify(sessionArray));
}
// Remove item from session array
function removeItemFromSession(itemId){
    // Filter out the item to be removed
    sessionArray = sessionArray.filter(item => item !== itemId);
    sessionStorage.setItem('blogStructure', JSON.stringify(sessionArray));
    console.log('New session array: ' + sessionArray);
    
}
// (!!! never used)Image preview function
function imagePreview(event){
    const file = event.target.files[0];

    if(file && file.type.startsWith("image/")){
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.getElementById('preview');
            img.scr = e.target.result;
            img.style.display = 'block';
        }

        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image.");
    }
}
// Function to upload an image (using python at the backend)
async function imageUpload(inputId) {
    const imageInput = document.getElementById(inputId);
    const file = imageInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
            // Wait for the image upload to complete
            const response = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log("Image uploaded successfully:", data);
                // Return the new image URL after upload is successful
                return "static/img/" + file.name;
            } else {
                console.error("Error uploading image:", data.message);
                return null;
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    } else {
        alert("Please select an image to upload.");
        return null;
    }
}
// Function to change the src of a targeted image element
function changePicture(imageUrl, imageId) {
    const imageElement = document.getElementById(imageId);
    imageElement.src = imageUrl;
}
//Function to display a selected file name when a file is chosen
function showFileName(inputId, elementId){
    // Get the input element by id
    const input = document.getElementById(inputId);
    // Get the display element (span) by id
    const displayElement = document.getElementById(elementId);
    // Validate to see if a file has been choosen if not set the text to an error message
    const fileName = input.files.length > 0 ? input.files[0].name : 'No file chosen';
    // Change the text of the tageted element to the chosen file's name
    displayElement.textContent = fileName;
}

// document.getElementById('saveButton').addEventListener('click', function(){ saveDataToDatabase(styleArray); });

// Send save object to the backend
function saveDataToDatabase(save){
    fetch('/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(save)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            console.log('Data saved successfully');
        } else {
            console.error('Error saving data:', result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Toggle the options list visability
function displayOptions(){
    const element = document.getElementById("options");
    if (element.style.display == 'block') {
        element.style.display = 'none';
    }else{
        element.style.display = 'block';
    }
}