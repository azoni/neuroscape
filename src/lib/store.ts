import { CardDatabase } from "./card-db";
import type { Card } from "./types";
import cardData from "./card-data.json";

const db = new CardDatabase();
db.load(cardData as Card[]);

export { db };
