import axios from "axios";

const GET_CHALLENGE = "/challenges/random";
const POST_RESULT = "/attempts";
const GET_ATTEMPTS_BY_ALIAS = '/attempts?alias=';
const GET_LEADERBOARD = '/leaders';
const GET_USERS_BY_IDS = '/users/';
const MULTIPLICATION_BASE_URL = "http://localhost:8080";
const GAMIFICATION_BASE_URL = "http://localhost:8081";


export const getChallenge = async () => {
      return await axios.get(MULTIPLICATION_BASE_URL + GET_CHALLENGE);
}

export const sendGuess = async (attempt) => {
    const data = {
        factorA: attempt.factorA,
        factorB: attempt.factorB,
        alias: attempt.alias,
        guess: +attempt.guess
    }
    return await axios.post(MULTIPLICATION_BASE_URL + POST_RESULT, data);        
}

export const getAttempts = async (alias) =>{
    return await axios.get(MULTIPLICATION_BASE_URL + GET_ATTEMPTS_BY_ALIAS + alias);
}

export const getLeaderBoard = async() => {
        return await axios.get(GAMIFICATION_BASE_URL + GET_LEADERBOARD);
}

export const getUsers = async(userId) => {
    return await axios.get(MULTIPLICATION_BASE_URL + GET_USERS_BY_IDS + userId.join(","));
}