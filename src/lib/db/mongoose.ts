import mongoose from "mongoose"

declare global {
  var __mongooseConnectionPromise__: Promise<typeof mongoose> | undefined
}

const MONGODB_URI = process.env.MONGODB_URI
const INVALID_MONGO_URI_MARKERS = ["<db_password>", "YOUR_MONGODB_PASSWORD"]

export const hasUsableMongoUri = (uri = MONGODB_URI) => {
  if (!uri) {
    return false
  }

  return !INVALID_MONGO_URI_MARKERS.some((marker) => uri.includes(marker))
}

export const connectDB = async (): Promise<typeof mongoose> => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
  }

  if (!hasUsableMongoUri(MONGODB_URI)) {
    throw new Error("MONGODB_URI still contains a placeholder password")
  }

  if (!global.__mongooseConnectionPromise__) {
    global.__mongooseConnectionPromise__ = mongoose.connect(MONGODB_URI, {
      dbName: "lekhalikhi",
    })
  }

  return global.__mongooseConnectionPromise__
}

export const getMongoDb = async () => {
  const connection = await connectDB()
  const database = connection.connection.db

  if (!database) {
    throw new Error("MongoDB database connection is not ready")
  }

  return database
}