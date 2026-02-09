const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "1234567890";


function randomChar(pool: string) {
  return pool[Math.floor(Math.random() * pool.length)];
}


export function generateFriendCode() {
    let firstPart = "";

    for (let i = 0; i < 4; i++) {
        firstPart += randomChar(LETTERS + NUMBERS);
    };


    let secondPart = "";


    for (let i = 0; i < 4; i++) {
        secondPart += randomChar(NUMBERS);
    };


    return `${firstPart}-${secondPart}`
}