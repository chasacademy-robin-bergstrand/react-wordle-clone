import { useEffect, useState } from "react";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [inputWord, setInputWord] = useState("");
    const [wordList, setWordList] = useState([]);
    const [gameWord, setGameWord] = useState("");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameGrid, setGameGrid] = useState([
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
        [[""], [""], [""], [""], [""]],
    ]);
    const [currentRow, setCurrentRow] = useState(0);
    const [wordGuessed, setWordGuessed] = useState(false);

    useEffect(() => {
        if (!dataLoaded) {
            getData();
        }

        if (wordGuessed) {
            console.log("POG YOU GOT IT");
        }

        if (currentRow <= 5) {
            updateInputRow();
        }
        /* const newGameGrid = [...gameGrid];
        for (let i = 0; i < 5; i++) {
            if (inputWord[i] == undefined) {
                newGameGrid[currentRow][i] = "";
            } else {
                newGameGrid[currentRow][i] = inputWord[i];
            }
        } 

        console.log("updating game grid");
        setGameGrid(newGameGrid);
        */

        if (!wordGuessed && gameStarted) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [inputWord, gameStarted]);

    function handleKeyDown(e) {
        //console.log(e);
        //console.log(inputWord);
        if (e.key == "Backspace") {
            setInputWord((old) => old.substring(0, old.length - 1));
            //updateInputRow();
            return;
        }
        if (
            inputWord.length < 5 &&
            "abcdefghijklmnopqrstuvwxyz".includes(e.key)
        ) {
            setInputWord((old) => old + e.key);
            //updateInputRow();
        }
        if (e.key == "Enter" && inputWord.length == 5) {
            const isValid = checkWordIsValid();
            if (isValid) {
                console.log("valid word adding to game grid");
                const newGameGrid = [...gameGrid];
                for (let i in inputWord) {
                    newGameGrid[currentRow][i] = [inputWord[i]];
                }
                setGameGrid(newGameGrid);
                if (currentRow < 6) {
                    setCurrentRow(currentRow + 1);
                }
                setInputWord("");
            }
            if (inputWord == gameWord) {
                setWordGuessed(true);
            }
        }
    }

    function updateInputRow() {
        const newGameGrid = [...gameGrid];
        for (let i = 0; i < 5; i++) {
            if (inputWord[i] == undefined) {
                newGameGrid[currentRow][i] = "";
            } else {
                newGameGrid[currentRow][i] = inputWord[i];
            }
        }
        //console.log("updating game grid");
        setGameGrid(newGameGrid);
    }

    async function getData() {
        const response = await fetch(
            "https://random-word-api.herokuapp.com/all"
        );
        const data = await response.json();
        const fiveLetterWords = data.filter((word) => {
            return word.length == 5;
        });
        console.log(fiveLetterWords);
        setDataLoaded(true);
        setWordList(fiveLetterWords);
    }

    function checkWordIsValid() {
        for (let idx in wordList) {
            //console.log(`checking ${wordList[idx]} against ${inputWord}`);
            if (wordList[idx].toUpperCase() == inputWord.toUpperCase()) {
                /* console.log(
                    wordList[idx].toUpperCase(),
                    "IS = ",
                    inputWord.toUpperCase()
                ); */
                return true;
            }
        }
        console.log("invalid word");
        return false;
    }

    function pickRandomWord() {
        const randomNumber = Math.floor(Math.random() * wordList.length);
        const randomWord = wordList[randomNumber];
        console.log(randomWord);
        setGameWord(randomWord);
    }

    function KeyboardButton({ letter }) {
        return (
            <button
                className="border-2 border-gray-300 bg-gray-200 p-2  mr-2 hover:bg-gray-300"
                onClick={() => {
                    if (inputWord.length < 5 && !wordGuessed) {
                        setInputWord((old) => old + letter.toLowerCase());
                        //updateInputRow();
                    }
                }}
            >
                {letter}
            </button>
        );
    }
    function BackspaceButton() {
        return (
            <button
                className="border-2 border-red-300 bg-red-200 p-2 mr-2 hover:bg-red-300"
                onClick={() =>
                    setInputWord((old) => old.substring(0, old.length - 1))
                }
            >
                DEL
            </button>
        );
    }
    function EnterButton() {
        return (
            <button
                className="border-2 border-green-300 bg-green-200 p-2  mr-2 hover:bg-green-300"
                onClick={() => {
                    const isValid = checkWordIsValid();
                    if (isValid) {
                        console.log("valid word adding to game grid");
                        const newGameGrid = [...gameGrid];
                        for (let i in inputWord) {
                            newGameGrid[currentRow][i] = [inputWord[i]];
                        }
                        setGameGrid(newGameGrid);
                        if (currentRow < 6) {
                            setCurrentRow(currentRow + 1);
                        }
                        setInputWord("");
                    }
                    if (inputWord == gameWord) {
                        setWordGuessed(true);
                    }
                }}
            >
                ENTER
            </button>
        );
    }

    return (
        <div
            className={`bg-gray-100 min-h-screen 
                        ${darkMode && "bg-gray-700"}
        `}
        >
            <header className="bg-gray-300 flex flex-row items-center">
                <h1 className="text-white text-5xl mx-auto p-2">MORDLE</h1>
                <button
                    className={`w-8 mr-4 aspect-square 
                    ${!darkMode && "bg-gray-700"}
                    ${darkMode && "bg-gray-200"}`}
                    onClick={() => setDarkMode(!darkMode)}
                ></button>
            </header>
            {dataLoaded && !gameStarted ? (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-800 bg-opacity-80">
                    <button
                        onClick={() => {
                            pickRandomWord();
                            setGameStarted(true);
                        }}
                        className="text-xl p-2 bg-green-300 border-2 border-green-400 hover:bg-green-400 text-black"
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                !dataLoaded &&
                !gameStarted && (
                    <div className="text-4xl absolute inset-0 grid place-items-center">
                        Loading...
                    </div>
                )
            )}
            {dataLoaded && gameStarted && (
                <main className="pt-8">
                    <div className="grid grid-cols-5 grid-rows-6 max-w-lg gap-2 mx-auto">
                        {gameGrid.map((row, rowIdx) => {
                            return row.map((col, colIdx) => {
                                return (
                                    <div
                                        key={[rowIdx, colIdx]}
                                        row={rowIdx}
                                        col={colIdx}
                                        style={{
                                            transitionDelay: `${
                                                300 * colIdx
                                            }ms`,
                                        }}
                                        className={`aspect-square border-2 transition ease-out duration-300 text-gray-600 font-semibold flex items-center justify-center text-3xl uppercase 
                                    ${
                                        (col ==
                                            gameWord[colIdx].toLowerCase()) &
                                        (currentRow > rowIdx)
                                            ? "bg-green-400"
                                            : gameWord
                                                  .toLowerCase()
                                                  .includes(col) &
                                              (col != "") &
                                              (currentRow > rowIdx)
                                            ? "bg-yellow-200"
                                            : currentRow > rowIdx
                                            ? "bg-gray-200"
                                            : "bg-white"
                                    }
                                    ${
                                        (col ==
                                            gameWord[colIdx].toLowerCase()) &
                                            (currentRow > rowIdx) &&
                                        "bg-green-400"
                                    }
                                    `}
                                    >
                                        {col}
                                    </div>
                                );
                            });
                        })}
                    </div>
                    <div className="w-fit mx-auto mt-6">
                        <div className="w-fit mx-auto">
                            <KeyboardButton letter={"Q"} />
                            <KeyboardButton letter={"W"} />
                            <KeyboardButton letter={"E"} />
                            <KeyboardButton letter={"R"} />
                            <KeyboardButton letter={"T"} />
                            <KeyboardButton letter={"Y"} />
                            <KeyboardButton letter={"U"} />
                            <KeyboardButton letter={"I"} />
                            <KeyboardButton letter={"O"} />
                            <KeyboardButton letter={"P"} />
                        </div>
                        <div className="w-fit mx-auto mt-2">
                            <KeyboardButton letter={"A"} />
                            <KeyboardButton letter={"S"} />
                            <KeyboardButton letter={"D"} />
                            <KeyboardButton letter={"F"} />
                            <KeyboardButton letter={"G"} />
                            <KeyboardButton letter={"H"} />
                            <KeyboardButton letter={"J"} />
                            <KeyboardButton letter={"K"} />
                            <KeyboardButton letter={"L"} />
                        </div>
                        <div className="w-fit mx-auto mt-2">
                            <BackspaceButton />
                            <KeyboardButton letter={"Z"} />
                            <KeyboardButton letter={"X"} />
                            <KeyboardButton letter={"C"} />
                            <KeyboardButton letter={"V"} />
                            <KeyboardButton letter={"B"} />
                            <KeyboardButton letter={"N"} />
                            <KeyboardButton letter={"M"} />
                            <EnterButton />
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
}

export default App;
