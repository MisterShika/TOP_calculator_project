class someCalculator{
    constructor(){
        this.calcLock = false;
        this.decimalLock = false;
        this.equalLock = false;
    }

    //Adds numbers. Allows calculator to add more notation or calculate equation.
    addDigit(numInput){
        this.calcLock = false;
        this.equalLock = false;
        if(document.getElementById("inputText").innerHTML === "0"){
            document.getElementById("inputText").innerHTML = numInput;
        }else{
            document.getElementById("inputText").innerHTML = document.getElementById("inputText").innerHTML + numInput;
        }
    }

    //Adds notation.
    addNonDigit(nonNumImput){
        document.getElementById("inputText").innerHTML = document.getElementById("inputText").innerHTML + nonNumImput;
    }
    
    //Adds decimals. Locks to prevent multiple decimals.
    addDecimal(){
        if(this.decimalLock === false){
            this.decimalLock = true;
            this.addNonDigit('.');
        }
    }
    
    //Adds notation. Prevents equation from calculating or additional (repeating) notations.
    addNotation(notationInput){
        if(this.calcLock === false){
            this.calcLock = true;
            this.decimalLock = false;
            this.equalLock = true;
            this.addNonDigit(notationInput);
        }
    }
    
    theCalculations(leftInput, calcInput, rightInput){
        let num1 = parseFloat(leftInput);
        let num2 = parseFloat(rightInput);
        switch(calcInput){
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '×':
                return num1 * num2;
            case '÷':
                return num1 / num2;
        }
    }

    clearCalc(){
        document.getElementById("inputText").innerHTML = '0';
    }


    calcTheInput(calcInput){
        if(this.equalLock === true){
            return;
        }
        //Splits the input in the textarea into an array.
        let theNum = calcInput.split(/(\+|\-|\×|\÷)/g).map(item => item.trim()).filter(item => item !== '');
   
        //If there are negative numbers, combines the minus symbol and its associated number.
        //Otherwise, parsing the array results in errors.
        if (theNum[0] === "-") {
            theNum.shift();
            theNum[0] = "-" + theNum[0];
        }
        for (let i = 1; i < theNum.length; i++) {
            if (theNum[i] === "-" && (theNum[i - 1] === "+" || theNum[i - 1] === "-" || theNum[i - 1] === "×" || theNum[i - 1] === "÷")) {
                theNum[i + 1] = "-" + theNum[i + 1];
                theNum.splice(i, 1);
            }
        }   
   
        //According to PEMDAS, parses equation doing division and multiplication.
        for(let i = 0; i < theNum.length; i++){
            if(theNum[i] === "×" || theNum[i] === "÷"){
                theNum[i] = this.theCalculations(theNum[i-1], theNum[i], theNum[i+1]);
                theNum.splice(i+1, 1);
                theNum.splice(i-1, 1);
                i--;
            }
        }
        //Parses the remaining array (addition and subtraction) until only one number remains.
        while(theNum.length > 1){
            for(let i = 0; i < theNum.length; i++){
                if(theNum[i] === "-" || theNum[i] === "+"){
                    theNum[i] = this.theCalculations(theNum[i-1], theNum[i], theNum[i+1]);
                    theNum.splice(i+1, 1);
                    theNum.splice(i-1, 1);
                    i--;
                }
            }
        }
        document.getElementById("inputText").innerHTML = theNum[0];
    }
}

const theCalculator = new someCalculator();

const equalButton = document.getElementById("equal");
const clearButton = document.getElementById("clear");
const numberButtons = document.querySelectorAll('.numberArea button');
const calcButtons = document.querySelectorAll('.calcArea button');

equalButton.addEventListener("click", () => {
    let theDisplayedInput = document.getElementById("inputText").innerHTML;
    theCalculator.calcTheInput(theDisplayedInput);
});

clearButton.addEventListener("click", () => {
    theCalculator.clearCalc();
});

numberButtons.forEach((numberButton) => {
    numberButton.addEventListener("click", function() {
        if(dataCalcValue = this.getAttribute("data-calc")){
            theCalculator.addDigit(dataCalcValue);
        }else if(this.id === 'decimal'){
            theCalculator.addDecimal();
        }
    });
});

calcButtons.forEach((calcButton) => {
    calcButton.addEventListener("click", function() {
        if(dataCalcValue = this.getAttribute("data-calc")){
            theCalculator.addNotation(dataCalcValue);
        }
    });
});