class Calculator {
    constructor(calcTarget) {
        // Initialize DOM elements
        this.onOffSwitch = calcTarget.getElementsByClassName('onoffswitch-checkbox')[0];
        this.digits = calcTarget.getElementsByClassName("digit");
        this.dots = calcTarget.getElementsByClassName("dot");
        this.keys = calcTarget.getElementsByClassName("keys")[0];
        this.digitsNum = this.digits.length;

        // Initialize state
        this.numberDisplayed = '';
        this.cash1 = false;
        this.cash2 = false;
        this.mathOperation = false;
        this.overflowFlag = false;
        this.inputing = true;
        this.addDot = false;
        this.equalMath = false;
        this.cPressCount = false;
        this.constflag = false;

        // Initialize registers
        this.registerX = { value: '00000000' };
        this.registerY = { value: '00000000' };
        this.registerC = { value: '00000000' };
        this.registerOperation = { value: '0000' };

        // Initialize flags
        this.flagChangeOperation = true;
        this.flagChangeNumber = false;
        
        // Ensure calculator starts in off state
        this.onOffSwitch.checked = false;

        // Bind methods
        this._keyboardDriver = this._keyboardDriver.bind(this);

        // Setup event listeners
        this.onOffSwitch.addEventListener("change", () => {
            if (this.onOffSwitch.checked) {
                this._switchOnCalc();
            } else {
                this._switchOffCalc();
            }
        });
    }
    
      
    
      

    _clearDisplay() {
        for (let i = 0; i < this.digitsNum; i++) {
            this.digits[i].style.opacity = "0.1";
            this.digits[i].innerHTML = "0";
        }
        this.digits[0].innerHTML = "-";
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].style.opacity = "0.1";
        }
    }

    _switchOnCalc() {
        this._clearDisplay();
        this.digits[this.digitsNum - 1].style.opacity = "1.0";
        this.digits[this.digitsNum - 1].innerHTML = "0";
        this.dots[this.digitsNum - 2].style.opacity = "1.0";
        
        // Reset state
        this.numberDisplayed = "";
        this.inputing = true;
        this.addDot = false;
        this.cash1 = false;
        this.cash2 = false;
        this.mathOperation = false;
        this.equalMath = false;

        // Reset registers
        this.registerX = { value: '00000000' };
        this.registerY = { value: '00000000' };
        this.registerC = { value: '00000000' };
        this.registerOperation = { value: 'O' };

        // Reset flags
        this.overflowFlag = false;
        this.flagChangeOperation = true;
        this.flagChangeNumber = false;

        this._updateFlagsAndRegisters();

        // Add keyboard listener
        this.keys.addEventListener("click", this._keyboardDriver);
    }

    _switchOffCalc() {
        // Reset registers
        this.registerX = { value: '00000000' };
        this.registerY = { value: '00000000' };
        this.registerC = { value: '00000000' };
        this.registerOperation = { value: 'O' };

        // Reset flags
        this.overflowFlag = false;
        this.flagChangeOperation = false;
        this.flagChangeNumber = false;

        this._updateFlagsAndRegisters();

        // Clear display
        for (let i = 0; i < this.digitsNum; i++) {
            this.digits[i].style.opacity = "0.0";
        }
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].style.opacity = "0.0";
        }

        // Remove keyboard listener
        this.keys.removeEventListener("click", this._keyboardDriver);
    }

    _preciseFloat(value) {
        // Конвертируем значение в число
        const num = Number(value);
      
        // Определяем знак числа
        const sign = num < 0 ? -1 : 1;
        const absNum = Math.abs(num);
      
        // Разделяем число на целую и дробную части
        const parts = absNum.toString().split('.');
      
        // Вычисляем количество десятичных знаков
        let decimalPlaces = parts[1] ? parts[1].length : 0;
      
        // Если дробная часть отсутствует, добавляем один десятичный знак
        if (decimalPlaces === 0) {
          decimalPlaces = 1;
        }
      
        // Формируем число с нужной точностью
        const result = sign * (parseInt(parts[0]) + parseInt(parts[1] || '0') / Math.pow(10, decimalPlaces));
      
        // Округляем результат до нужной точности
        return Number(result.toFixed(decimalPlaces));
      }

    _overflowfunc() {
        // Reset registers
        this.registerX = { value: '00000000' }; 
        this.registerY = { value: '00000000' };
        this.registerC = { value: '00000000' };
        this.registerOperation = { value: '0000' };

    
        this.overflowFlag = true;
        this.flagChangeOperation = true;
        this.flagChangeNumber = false;

        this._updateFlagsAndRegisters();

        // Clear display
        
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].style.opacity = "1.0";
        }

        // Remove keyboard listener
     /* this.keys.removeEventListener("click", this._keyboardDriver); */
    }

    _showOnScreen(num) {
        
        const toDisplay = [];
        if (Number.isNaN(num) || num === Infinity || num === -Infinity) {
           
            this.overflowFlag = true;
            num = "";
            toDisplay.push(...Array(7).fill(0));
            this._overflowfunc();
            
            
            
        }

       
            this._clearDisplay();
            
            const fractionToDisplay = [];
        /*    this.overflowFlag = false; */
            let isNegative = false;
            let allFractionAddedIsZero = true;
            let dotPosition = 0;

            if (num < 0) {
                isNegative = true;
                num = Math.abs(num);
            }

            const [integerStr, fractionStr] = num.toString().split(".");
            const integerPart = integerStr.split("");
            let fractionPart = fractionStr ? fractionStr.split("") : null;
            
            if (integerPart.length > 8) {
                this.overflowFlag = true;
                integerPart.splice(8);
               /* this.overflowFlag = true; */
                this._overflowfunc();
            }
            
            if (integerPart.length < 1) {
                integerPart.push(0);
                
            }
            
            toDisplay.push(...integerPart);
            
            if (fractionPart) {
                // Trim trailing zeros
               

                for (let i = 0; i + 1 + integerPart.length <= this.digitsNum - 1 && i < fractionPart.length; i++) {
                    
                    fractionToDisplay.push(fractionPart[i]);
                }

               
                    toDisplay.push(...fractionToDisplay);
                    
                    dotPosition = this.dots.length - 1 - (this.digitsNum - 2 - fractionToDisplay.length);
                    
                   
                    
            }
            
            this.numberDisplayed = (integerPart[0] === '0' && !fractionPart ? "" : integerPart.join("") + (fractionToDisplay.length ? "." : "") + (fractionToDisplay.length ? fractionToDisplay.join("") : ""));
            
            if (isNegative) {
                this.numberDisplayed *= -1;
                this.digits[0].style.opacity = "1.0";
                this.digits[0].innerHTML = "-";
            }

            if (this.overflowFlag) {
                for (let i = 0; i < this.dots.length; i++) {
                    this.dots[i].style.opacity = "1.0";
                }
            } else {
                this.dots[this.dots.length - 1 - dotPosition].style.opacity = "1.0";
            }

            for (let i = toDisplay.length - 1; i >= 0; i--) {
                this.digits[this.digitsNum - 1 - toDisplay.length + 1 + i].style.opacity = "1.0";
                this.digits[this.digitsNum - 1 - toDisplay.length + 1 + i].innerHTML = toDisplay[i];
            }
       

        this._updateFlagsAndRegisters();
    }

    _keyboardDriver(evt) {
        const value = evt.target.value;
        if (!value) return;

        switch (true) {
            case value === "C":
                this.cPressCount = false;
                if (this.overflowFlag) {
                    this.overflowFlag = false;
                    this._showOnScreen(this.numberDisplayed);
                } else {
                    this._switchOnCalc();
                }
                break;

            case /[0-9]/.test(value): 
                if (!this.overflowFlag) {
                    if (this.numberDisplayed.toString().split(".")[0].length < this.digitsNum - 1 || !this.inputing) {
                        this.flagChangeNumber = false;

                        if (this.inputing) {
                            this.registerY.value = this.cash1 ? this.cash1 : 0;
                           
                            if (this.addDot) {
                                
                                const newValue = this.numberDisplayed.toString() + "." + (value);
                                
                                this.registerX.value = newValue;
                                this.addDot = false;
                                
                                this._showOnScreen(newValue);
                                
                            } else {
                                 
                                const newValue = (this.numberDisplayed[0] === '0' && this.addDot ? this.numberDisplayed = value : this.numberDisplayed.toString() + value);
                                
                                this.registerX.value = newValue;
                                
                                this._showOnScreen(newValue); 
                            }
                            
                        } else {
                            this.registerY.value = this.cash1 ? this.cash1 : 0;
                            this.inputing = true;

                            if (this.addDot) {
                                  
                                const newValue = parseFloat("0." + value);
                                this.registerX.value = newValue;
                                this.addDot = false;
                            
                                this._showOnScreen(newValue);
                                
                            } else {
                                
                                const newValue = parseFloat(value);
                                this.registerX.value = newValue;
                                this._showOnScreen(newValue);
                            }
                        }
                    }
                }
                break;

            case value === "." && !this.cPressCount:
                if (!this.addDot) {
                    this.addDot = true;  
                    this.cPressCount = true;
                    console.log(123);
                } 
                break;

            case value === "percent":
                if (!this.overflowFlag) {
                    
		    
		    this.registerC.value = this.numberDisplayed * this.registerY.value / 100;

		    this.registerX.value = this.numberDisplayed * this.registerY.value / 100;
		    this.registerY.value = this.registerC.value;
		    
		    console.log(this.registerY.value);

		    this._showOnScreen(this.registerX.value);
                    
                    		    
		    this.registerOperation.value = "perc"
                    this.inputing = false;
                    
                    this.flagChangeOperation = false;
                    this.flagChangeNumber = true;
                    
                }
                break;
            
              



            case /[\+\-x\/]/.test(value):
                this.cPressCount = false;
                this.registerY.value = this.numberDisplayed;
                if (!this.overflowFlag) {
                    
                    
                    if (this.mathOperation && !this.equalMath) {
                        // Дублируем значение из X в Y
                        this.registerY.value = this.registerX.value;
                        
                        if (this.registerC.value === "00000000") {
                            this.registerC.value = this.registerX.value; // Дублируем значение из X в C
                        }
                        
                        
                        let result = this.mathOperation(
                            this._preciseFloat(this.cash1),
                            this.flagChangeNumber ? this._preciseFloat(this.registerC.value) : this._preciseFloat(this.registerY.value)
                          );
                       
                          
                        if (Math.abs(result) < 1e-7 || result.toString().includes('e')) {
                            result = 0;
                            
                        } 
                        else {
                            result = parseFloat(result.toFixed(10));
                        }
                        
                        
                        // Обновляем регистры и экран
                        this.registerX.value = result;
                        
                        this.registerY.value = this.numberDisplayed;
                        //this.registerC.value = this.numberDisplayed;
                        console.log(result);
                        this._showOnScreen(result);
        
                        // Обновляем cash1 для следующей операции
                    
                    
                    } 
                    
                    this.inputing = false;
                    this.flagChangeOperation = false;
                    this.flagChangeNumber = true;
                    this.constflag = false;
                    const operations = {
                        '+': { code: '+', fn: (a, b) => a + b },
                        '-': { code: '-', fn: (a, b) => a - b },
                        'x': { code: '*', fn: (a, b) => a * b },
                        '/': { code: '/', fn: (a, b) => a / b }
                        
                    };
                    
                    this.registerOperation.value = operations[value].code;

                    if (this.cash1 === false || this.equalMath) {
                        this.cash1 = this.numberDisplayed;
                        this.mathOperation = operations[value].fn;
                    } else {
                        this.cash2 = this.numberDisplayed;
                        this.cash1 = this.numberDisplayed;
                        this.mathOperation = operations[value].fn;
                    }

                    this.equalMath = false;
                }
                    break;

            case value === "=":
                

                if (!this.overflowFlag) {
                    if (this.cash1 !== false) {
                        this.flagChangeNumber = true;
                        
                        if (this.cash2 === false) {
                            this.cash2 = this.numberDisplayed;
                        } else {
                            if (this.equalMath) {
                                this.cash1 = this.numberDisplayed;
                            } else {
                                this.cash2 = this.numberDisplayed;
                            }
                        }

                        let result = this.mathOperation(this._preciseFloat(this.cash1), this._preciseFloat(this.cash2));
                        console.log(result);
                        if (Math.abs(result) < 1e-9 || result.toString().includes('e')) {
                            result = 0;
                        } else {
                            result = parseFloat(result.toFixed(10));
                        }

                        this.registerX.value = result;
                        
                        this.registerY.value = this.cash2; 
                        this.registerC.value = this.cash2;
                        this.flagChangeOperation = true;

                        this._showOnScreen(result);
                        
                        this.equalMath = true;
                        if (!this.overflowFlag && this.equalMath) {
                            this.inputing = false;
                            this.constflag = true;
                            this.equalMath = true;
                        }
                        
                        
                    }

                }
            
                break;
        }
        if (this.constflag) {
              this.registerY.value = this.registerC.value;
              
        }
    
        this._updateFlagsAndRegisters();
    }

    _updateFlagsAndRegisters() {
        this._displayRegisters();
        this._displayFlags();
    }

    _displayRegisters() {
        const formatValue = (value) => {
            let formattedValue = '';
            let isNegative = false;
    
            // Определяем, является ли значение отрицательным
            if (typeof value === 'string' && value.startsWith('-')) {
                isNegative = true;
                value = value.slice(1);
            } else if (typeof value === 'number' && value < 0) {
                isNegative = true;
                value = Math.abs(value);
            }
    
            // Преобразуем число в строку
            formattedValue = value.toString();
    
            // Разделяем число на целую и дробную части
            let parts = formattedValue.split('.');
            let integerPart = parts[0];
            let decimalPart = parts.length > 1 ? parts[1] : '';
           
            if (decimalPart.length > 0) {
                if (decimalPart.length > 7) {
                    decimalPart = decimalPart.slice(0, 7);
                } else {
                    while ((integerPart.length +  decimalPart.length) < 8) {
                        decimalPart += '0';
                    }
                }

                if (integerPart === '') {
                    integerPart = '0';
                    if (decimalPart.length > 7) {
                        decimalPart = decimalPart.slice(0, 7);
                    }
                    
                }
            
                let formattedValueBuild = integerPart + '.' + decimalPart;
                if (formattedValueBuild.length > 8) {
                    formattedValueBuild = formattedValueBuild.slice(0,9);
                }
                formattedValue = formattedValueBuild;
            } else {
                // Для целых чисел
                if (integerPart.length > 8) {
                    formattedValue = integerPart.slice(0, 8);
                } else {
                    formattedValue = integerPart.padStart(8, '0');
                }
            }
    
            // Добавляем минус справа, если число отрицательное
            return isNegative ? '-' + formattedValue : formattedValue;
        };

        document.getElementById('register_x').querySelector('.register-digit').textContent = 
            formatValue(this.registerX.value);
        document.getElementById('register_y').querySelector('.register-digit').textContent = 
            formatValue(this.registerY.value);
        document.getElementById('register_c').querySelector('.register-digit').textContent = 
            formatValue(this.registerC.value);
        document.getElementById('register_operation').querySelector('.register-digit').textContent = 
            this.registerOperation.value;
    }

    _displayFlags() {
        document.getElementById('flag_overflow').textContent = this.overflowFlag ? '1' : '0';
        document.getElementById('flag_change_operation').textContent = this.flagChangeOperation ? '1' : '0';
        document.getElementById('flag_change_number').textContent = this.flagChangeNumber ? '1' : '0';
    }
}

// Initialize calculator on page load
window.addEventListener('load', () => {
    const calculatorElement = document.getElementById("myCalc");
    new Calculator(calculatorElement);
});