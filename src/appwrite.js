import { Client, ID, Query, TablesDB } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

export const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID || "6ad110ba001aee523789");

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  if (!DATABASE_ID || !TABLE_ID) {
    throw new Error(
      "Configure VITE_APPWRITE_DATABASE_ID and VITE_APPWRITE_TABLE_ID in .env.local."
    );
  }

  const matches = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [Query.equal("searchTerm", searchTerm)],
    total: false,
  });

  const existingRow = matches.rows[0];

  if (existingRow) {
    return tablesDB.incrementRowColumn({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId: existingRow.$id,
      column: "count",
    });
  }

  return tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: ID.unique(),
    data: {
      searchTerm,
      count: 1,
      movie_id: movie.id,
      poster_url: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
    },
  });
};