from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

type_data = {

    "normal": {
        "double_from": ["fighting"],
        "double_to": []
    },

    "fire": {
        "double_from": ["water", "ground", "rock"],
        "double_to": ["grass", "ice", "bug", "steel"]
    },

    "water": {
        "double_from": ["electric", "grass"],
        "double_to": ["fire", "ground", "rock"]
    },

    "electric": {
        "double_from": ["ground"],
        "double_to": ["water", "flying"]
    },

    "grass": {
        "double_from": ["fire", "ice", "poison", "flying", "bug"],
        "double_to": ["water", "ground", "rock"]
    },

    "ice": {
        "double_from": ["fire", "fighting", "rock", "steel"],
        "double_to": ["grass", "ground", "flying", "dragon"]
    },

    "fighting": {
        "double_from": ["flying", "psychic", "fairy"],
        "double_to": ["normal", "ice", "rock", "dark", "steel"]
    },

    "poison": {
        "double_from": ["ground", "psychic"],
        "double_to": ["grass", "fairy"]
    },

    "ground": {
        "double_from": ["water", "grass", "ice"],
        "double_to": ["fire", "electric", "poison", "rock", "steel"]
    },

    "flying": {
        "double_from": ["electric", "ice", "rock"],
        "double_to": ["grass", "fighting", "bug"]
    },

    "psychic": {
        "double_from": ["bug", "ghost", "dark"],
        "double_to": ["fighting", "poison"]
    },

    "bug": {
        "double_from": ["fire", "flying", "rock"],
        "double_to": ["grass", "psychic", "dark"]
    },

    "rock": {
        "double_from": ["water", "grass", "fighting", "ground", "steel"],
        "double_to": ["fire", "ice", "flying", "bug"]
    },

    "ghost": {
        "double_from": ["ghost", "dark"],
        "double_to": ["psychic", "ghost"]
    },

    "dragon": {
        "double_from": ["ice", "dragon", "fairy"],
        "double_to": ["dragon"]
    },

    "dark": {
        "double_from": ["fighting", "bug", "fairy"],
        "double_to": ["psychic", "ghost"]
    },

    "steel": {
        "double_from": ["fire", "fighting", "ground"],
        "double_to": ["ice", "rock", "fairy"]
    },

    "fairy": {
        "double_from": ["poison", "steel"],
        "double_to": ["fighting", "dragon", "dark"]
    }
}

all_types = list(type_data.keys())


#model format for data 
class Pokemon(BaseModel):
    name: str
    types: List[str]

class TeamRequest(BaseModel):
    team: List[Pokemon]


@app.post("/analyze")
def analyze_team(request: TeamRequest):

    coverage = []
    weakness_counts = {}

    #type coverage 
    for pokemon in request.team:
        for p_type in pokemon.types:
            strong_against = type_data[p_type]["double_to"]

            for target in strong_against:
                if target not in coverage:
                    coverage.append(target)

    #weakness count 
    for attack_type in all_types:
        count = 0

        for pokemon in request.team:
            multiplier = 1

            for p_type in pokemon.types:
                if attack_type in type_data[p_type]["double_from"]:
                    multiplier *= 2

            if multiplier > 1:
                count += 1

        if count > 0:
            weakness_counts[attack_type] = count

    return {
        "coverage_against": coverage,
        "weakness_summary": weakness_counts
    }
