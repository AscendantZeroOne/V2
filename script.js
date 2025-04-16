let fileHandle;

async function createFile() {
    document.getElementById('editor').innerText = '';
    updateLineNumbers();
    fileHandle = null;
}

async function openFile() {
    try {
        [fileHandle] = await window.showOpenFilePicker({
            types: [{ description: 'Text Files', accept: { 'text/plain': ['.txt'] } }]
        });
        const file = await fileHandle.getFile();
        const contents = await file.text();
        document.getElementById('editor').innerText = contents;
        updateLineNumbers();
        updateHighlighting();
    } catch (err) {
        console.error('Failed to open file:', err);
    }
}

async function saveFile() {
    try {
        if (!fileHandle) {
            fileHandle = await window.showSaveFilePicker({
                suggestedName: 'untitled.txt',
                types: [{ description: 'Text Files', accept: { 'text/plain': ['.txt'] } }]
            });
        }
        const writable = await fileHandle.createWritable();
        await writable.write(document.getElementById('editor').innerText);
        await writable.close();
    } catch (err) {
        console.error('Failed to save file:', err);
    }
}

function updateLineNumbers() {
    const editor = document.getElementById('editor');
    const lineNumbers = document.getElementById('line-numbers');

    let lines = 1;

    const childNodes = editor.childNodes;
    lines = Array.from(childNodes).filter(node => node.nodeType === 1 || node.nodeType === 3).length;

    console.log("Line count:", lines);
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

function handlePasteEvent(event) {
    const editor = document.getElementById('editor');
    const lineNumbers = document.getElementById('line-numbers');
    
    setTimeout(() => {
        const text = editor.innerText;
        const lines = text.split(/\n|\r/).length;
        
        console.log("Pasted line count:", lines);
        lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
    }, 0);
}

document.getElementById('editor').addEventListener('paste', handlePasteEvent);


document.getElementById('editor').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {

        insertNewLineWithZeroWidthSpace();
        updateLineNumbers();
    }
});

function insertNewLineWithZeroWidthSpace() {
    document.execCommand('insertHTML', false, '<div>&#8203;</div>');
}


function syncScroll() {
    document.getElementById('line-numbers').scrollTop = document.getElementById('editor').scrollTop;
    document.getElementById('highlighting').scrollTop = document.getElementById('editor').scrollTop;
}

const keywords = ["program", "procedure", "begin", "end", "if", "then", "else", "while", "do", "read", "write", "true", "false"];
const operators = ["=", "<>", "<", "<=", ">=", "/", ">", "+", "-", "*", "and", "or", "not", ":="];
const varNames = ["int", "float", "String", "double", "bool"];
const symbols = ["(", ")", ",", ".", ";"];
const floatRegex = /\d+\.\d+/g;
const numbersRegex = /\d+/g;
const identifiersRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
const invalidIdentifierRegex = /\d+[a-zA-Z_]+|&\w*|%\w*|#\w*|@\w*|[a-zA-Z0-9_]{24, }/;

function updateHighlighting() {
    const editor = document.getElementById('editor');
    const highlighting = document.getElementById('highlighting');

    let text = editor.innerHTML;
    let highlightedText = text.replace(/\b(\w+)\b/g, (match) => {
        if (keywords.includes(match)) {
            return `<span id="keywords" style="color: red;">${match}</span>`;
        } if(operators.includes(match)) {
            return `<span id="keywords" style="color: blue;">${match}</span>`;
        }
        return match;
    });

    highlighting.innerHTML = highlightedText;
}



function buildTable() {
    const text = document.getElementById('editor').innerText;
    const lines = text.split('\n');
    let tableHtml = '<table border="1"><thead><tr><th>Palavra</th><th>Token</th><th>Linha</th><th>Coluna Inicial</th><th>Coluna Final</th></tr></thead><tbody>';
    
   const tokenRegex = /\d+\.\d+|\d*[@%#&a-zA-Z_]+\d*|(program|procedure|begin|end|if|then|else|while|do|read|write|true|false)|[a-zA-Z_][a-zA-Z0-9_]*|\d+|[=<>+\-*/();,.]|:=/g;
   
   let insideCommentBlock = false;
    
   for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        let line = lines[lineIndex];
        
        rowStyle = "";

        let commentIndex = line.indexOf('//');
        if (commentIndex !== -1) {
            line = line.substring(0, commentIndex);
        }
        

        if (insideCommentBlock) {
            let endCommentIndex = line.indexOf('}');
            if (endCommentIndex !== -1) {
                insideCommentBlock = false;
                line = line.substring(endCommentIndex + 1);
            } else {
                continue;
            }
        }
        
        let startCommentIndex = line.indexOf('{');
        if (startCommentIndex !== -1) {
            insideCommentBlock = true;
            line = line.substring(0, startCommentIndex);
        }
        
        
        
        let match;
        while ((match = tokenRegex.exec(line)) !== null) {
            const word = match[0];
            let token;
            if (keywords.includes(word)) {
                if(word.includes("program"))
                {
                    token = "PalavraReservada_Program";
                }
                if(word.includes("procedure"))
                {
                    token = "PalavraReservada_Procedure";
                }
                if(word.includes("begin"))
                {
                    token = "PalavraReservada_Begin";
                } 
                if(word.includes("end"))
                {
                    token = "PalavraReservada_End";
                }
                if(word.includes("if"))
                {
                    token = "PalavraReservada_If";
                }
                if(word.includes("then"))
                {
                    token = "PalavraReservada_Then";
                }
                if(word.includes("else"))
                {
                    token = "PalavraReservada_Else";
                }
                if(word.includes("while"))
                {
                    token = "PalavraReservada_While";
                }
                if(word.includes("do"))
                {
                    token = "PalavraReservada_Do";
                }
                if(word.includes("read"))
                {
                    token = "PalavraReservada_Read";
                }
                if(word.includes("write"))
                {
                    token = "PalavraReservada_Write";
                }
                if(word.includes("true"))
                {
                    token = "PalavraReservada_true";
                }
                if(word.includes("false"))
                {
                    token = "PalavraReservada_False";
                }  
                
            } else if (operators.includes(word)) {
                if(word.includes("="))
                {
                    token = "Operator_equivalence";
                }
                if(word.includes("<>"))
                {
                    token = "Operator_<>";
                }
                if(word.includes("<"))
                {
                    token = "Operator_lesser";
                }
                if(word.includes("<="))
                {
                    token = "Operator_lesserequal";
                }
                if(word.includes(">="))
                {
                    token = "Operator_greaterequal";
                }
                if(word.includes(">"))
                {
                    token = "Operator_greater";
                }
                if(word.includes("+"))
                {
                    token = "Operator_plus";
                }
                if(word.includes("-"))
                {
                    token = "Operator_-";
                }
                if(word.includes("*"))
                {
                    token = "Operator_multiplication";
                }
                if(word.includes("and"))
                {
                    token = "Operator_logicalOperatorAnd";
                }
                if(word.includes("/"))
                {
                    token = "Operator_div";
                }
                if(word.includes("or"))
                {
                    token = "Operator_logicalOperatorOr";
                }
                if(word.includes("not"))
                {
                    token = "Operator_logicalOperatorNot";
                }
                if(word.includes(":="))
                {
                    token = "Operator_att";
                }
                
            } else if(varNames.includes(word))
            {
                if(word.includes("int"))
                {
                    token = "Int_Type";
                }
                if(word.includes("float"))
                {
                    token = "Float_Type";
                }
                if(word.includes("String"))
                {
                    token = "String_Type";
                }
                if(word.includes("double"))
                {
                    token = "Double_Type";
                }
                if(word.includes("bool"))
                {
                    token = "Bool_Type";
                }

            } else if (symbols.includes(word)) {
                if (word === "(") {
                    token = "Symbol_LeftParenthesis";
                } else if (word === ")") {
                    token = "Symbol_RightParenthesis";
                } else if (word === ",") {
                    token = "Symbol_Comma";
                } else if (word === ".") {
                    token = "Symbol_Dot";
                } else if (word === ";") {
                    token = "Symbol_Semicolon";
                }
            } else if (invalidIdentifierRegex.test(word)) {
                token = "Lexicon_Error";
                rowStyle = ' style="background-color: red; color: white;"';
            } else if (floatRegex.test(word)) {
                token = "Número_Float";
            } else if (!isNaN(word)) {
                token = "Número";
            } else {
                token = "Identificador";
            } 

            if (!token.includes("Lexicon_Error"))
            {
                rowStyle = ' style="background-color: white; color: black;"';
            }

            if (word.length > 30) {
                token = "Lexicon_Error";
                rowStyle = ' style="background-color: red; color: white;"';
            }

            const startCol = match.index + 1;
            const endCol = startCol + word.length - 1;
            
            tableHtml += `<tr${rowStyle}><td>${word}</td><td>${token}</td><td>${lineIndex + 1}</td><td>${startCol}</td><td>${endCol}</td></tr>`;
        }
    }
    
    tableHtml += '</tbody></table>';
    document.getElementById('table-container').innerHTML = tableHtml;
}
