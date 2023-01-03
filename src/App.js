import React, { useState } from "react";
import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

// following sets the btnValues array with buttons want to use
const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

//following removes invalid charcters (got from web)
const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const App = () => {
  let [calc, setCalc] = useState({sign: "", num: 0, res: 0,});

  const numClickHandler = (event) => {
    event.preventDefault();
    const value = event.target.innerHTML;
// ? if true : or, && if true and if true
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };
// following handles if . pressed
  const commaClickHandler = (event) => {
    event.preventDefault();
    const value = event.target.innerHTML;
    setCalc({...calc, num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,});
  };
// following handles what sign is pressed
  const signClickHandler = (event) => {
    event.preventDefault();
    const value = event.target.innerHTML;
    setCalc({...calc, sign: value, res: !calc.res && calc.num ? calc.num : calc.res, num: 0,});
  };
//Following handles the maths with details from above
  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      const math = (a, b, sign) =>
        sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;
// following checks for divide by 0 and displays msg
      setCalc({
        ...calc, res: calc.num === "0" && calc.sign === "/" ? "Can't divide with 0"
          : toLocaleString(math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)),
          calc.sign)), sign: "", num: 0,
      });
    }
  };
  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };
//following handles % calculations
  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc, num: (num /= Math.pow(100, 1)), res: (res /= Math.pow(100, 1)), sign: "",
    });
  };
//Following resets calc and sign when C is clicked
  const resetClickHandler = () => {
    setCalc({
      ...calc, sign: "", num: 0, res: 0,
    });
  };
// following handles the input and outputs the result 'value'
  return (
    <Wrapper>
      <Screen value={calc.num ? calc.num : calc.res} />
      <ButtonBox>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn === "=" ? "equals" : ""}
              value={btn}
              onClick={
                btn === "C"
                  ? resetClickHandler
                  : btn === "+-"
                  ? invertClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                  ? signClickHandler
                  : btn === "."
                  ? commaClickHandler
                  : numClickHandler
              }
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
};

export default App;